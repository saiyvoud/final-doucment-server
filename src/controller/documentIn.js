import connected from "../config/db_mysql.js";
import { EMessage, FollowDocument, SMessage, StatusDocument, } from "../service/message.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";
import { v4 as uuidv4 } from "uuid"
import { CheckDocumentIn, FindOneDocumentIn, FindOnePartDemand } from "../service/service.js";
import { UploadImageToCloud } from "../config/cloudinary.js";
export default class DocumentInController {
    static async Search(req, res) {
        try {
            const search = req.query.search;
            const query = `
            SELECT * FROM document_in 
            INNER JOIN document_type on document_in.document_type_id COLLATE utf8mb4_general_ci = document_type.document_type_id
            INNER JOIN faculty on document_in.faculty_id COLLATE utf8mb4_general_ci = faculty.faculty_id
            WHERE numberID LIKE ?
            `;
            const values = [`%${search}%`];
            //const values = [search];
            connected.query(query, values, (err, result) => {
                if (err) return SendError(res, 404, EMessage.NotFound, err);
                if (!result[0]) return SendError(res, 404, EMessage.NotFound);
                return SendSuccess(res, SMessage.Search, result);
            });
        } catch (error) {
            return SendError(res, 500, EMessage.Eserver, error);
        }
    }
    
    static async SelectAll(req, res) {
        try {
            const select = `select * from document_in 
            INNER JOIN document_type on document_in.document_type_id COLLATE utf8mb4_general_ci = document_type.document_type_id
            INNER JOIN faculty on document_in.faculty_id COLLATE utf8mb4_general_ci = faculty.faculty_id
            ORDER BY document_in.updatedAt DESC;
            `;
            // INNER JOIN part_demand on document_in. COLLATE utf8mb4_general_ci = part_demand.
            connected.query(select, (err, result) => {
                if (err) return SendError(res, 404, EMessage.ESelectAll, err);
                // if (!result[0]) return SendError(res, 404, EMessage.NotFound);
                return SendSuccess(res, SMessage.SelectAll, result);
            })
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async SelectOne(req, res) {
        try {
            const document_in_id = req.params.document_in_id;
            if (!document_in_id) return SendError(res, 400, EMessage.BadRequest, "document_in_id");
            await FindOneDocumentIn(document_in_id);
            const select = `select * from document_in 
            INNER JOIN document_type on document_in.document_type_id COLLATE utf8mb4_general_ci = document_type.document_type_id
            INNER JOIN faculty on document_in.faculty_id COLLATE utf8mb4_general_ci = faculty.faculty_id WHERE document_in_id=?`;
            connected.query(select, document_in_id, (err, result) => {
                if (err) return SendError(res, 404, EMessage.NotFound, err);
                if (!result[0]) return SendError(res, 404, EMessage.NotFound);
                return SendSuccess(res, SMessage.SelectOne, result[0]);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async Insert(req, res) {
        try {
            const { title, destinationName, destinationNumber, faculty_id, numberID, contactName, contactNumber, document_type_id, date, description, sendDoc } = req.body;
            const validate = await ValidateData({ title, faculty_id, destinationName, destinationNumber, numberID, contactName, contactNumber, document_type_id, date, description, sendDoc });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(","))
            }
          const check =   await CheckDocumentIn(numberID);
          if (!check) { 
            return SendError(res, 400,EMessage.NotFound) 
        }
            const fileData = req.files;
            if (!fileData || !fileData.files) {
                return SendError(res, 400, EMessage.BadRequest, "files")
            }
            // await FindOnePartDemand();
            const files_url = await UploadImageToCloud(fileData.files.data, fileData.files.mimetype);
            if (!files_url) {
                return SendError(res, 400, EMessage.NotFound, "File");
            }
            const document_in_id = uuidv4();
            const insert = `insert into document_in (document_in_id, title, numberID,contactName,contactNumber,date,faculty_id,document_type_id,description,files,status,destinationName,destinationNumber,sendDoc) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

            connected.query(insert, [document_in_id, title,
                numberID, contactName, contactNumber, date,
                faculty_id, document_type_id, description, files_url, FollowDocument.await, destinationName, destinationNumber, sendDoc], (err) => {
                    if (err) {
                        console.log(err);
                        return SendError(res, 404, EMessage.EInsert, err);
                    }
                    const follow_document_in_id = uuidv4();
                    const datetime = new Date()
                    const insert2 = "insert into follow_document_in (follow_document_in_id,document_in_id,statusName,time) values (?,?,?,?)";
                    connected.query(insert2, [follow_document_in_id, document_in_id, FollowDocument.await, datetime], (err) => {
                        if (err) return SendError(res, 404, EMessage.EInsert, err);
                        return SendCreate(res, SMessage.Insert);
                    })
                    //return SendCreate(res, SMessage.Insert);
                })
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
    static async UpdateDocumentIn(req, res) {
        try {
            const document_in_id = req.params.document_in_id;
            if (!document_in_id) return SendError(res, 400, EMessage.BadRequest, "document_in_id");
            const document = await FindOneDocumentIn(document_in_id);
            const { title, numberID, destinationName, destinationNumber, faculty_id, contactName, contactNumber, document_type_id, date, description, sendDoc, status } = req.body;
            const validate = await ValidateData({ title, numberID, faculty_id, contactName, contactNumber, document_type_id, date, destinationName, destinationNumber, sendDoc, status });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(","))
            }
            const update = `Update document_in set title=?, numberID=?,contactName=?,contactNumber=?, date=?, faculty_id=?,document_type_id=?,description=? ,destinationName=?,destinationNumber=?,sendDoc=?,status=? where document_in_id=?`
            connected.query(update, [title, numberID, contactName, contactNumber, date, faculty_id, document_type_id, description, destinationName, destinationNumber, sendDoc, status, document_in_id], (err) => {
                if (err) return SendError(res, 404, EMessage.EUpdate, err);
                const follow_document_in_id = uuidv4();
                const datetime = new Date()
                if (document.status !== status) {
                    const insert2 = "insert into follow_document_in (follow_document_in_id,document_in_id,statusName,time) values (?,?,?,?)";
                    connected.query(insert2, [follow_document_in_id, document_in_id, status, datetime], (err) => {
                        if (err) return SendError(res, 404, EMessage.EInsert, err);
                        return SendSuccess(res, SMessage.Update);
                    })
                }else{
                    return SendSuccess(res, SMessage.Update);
                }
              
               // return SendSuccess(res, SMessage.Update);
            })
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
    static async UpdateStatus(req, res) {
        try {
            const document_in_id = req.params.document_in_id;
            if (!document_in_id) return SendError(res, 400, EMessage.BadRequest, "document_in_id");
            await FindOneDocumentIn(document_in_id);
            const { status } = req.body;
            const checkStatus = Object.values(FollowDocument);
            if (!checkStatus.includes(status)) {
                return SendError(res, 400, EMessage.BadRequest);
            }
            const update = "update document_in set status=? where document_in_id=?";
            connected.query(update, [status, document_in_id], (err) => {
                if (err) return SendError(res, 404, EMessage.EUpdate, err);
                return SendSuccess(res, SMessage.Update);
            })
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
    static async DeleteDocumentIn(req, res) {
        try {
            const document_in_id = req.params.document_in_id;
            if (!document_in_id) return SendError(res, 400, EMessage.BadRequest, "document_in_id");
            await FindOneDocumentIn(document_in_id); (document_in_id);
            const deletedocument_in = "Delete from document_in where document_in_id=?";
            connected.query(deletedocument_in, document_in_id, (err) => {
                if (err) return SendError(res, 404, EMessage.EDelete, err);
                return SendSuccess(res, SMessage.Delete);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
}