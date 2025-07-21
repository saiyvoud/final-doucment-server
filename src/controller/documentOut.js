import connected from "../config/db_mysql.js";
import { EMessage, FollowDocument, SMessage, StatusDocument } from "../service/message.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";
import { v4 as uuidv4 } from "uuid"
import { UploadImageToCloud } from "../config/cloudinary.js"
import { FindOneDocumentIn, FindOneDocumentOut, FindOnePartSuppile } from "../service/service.js";
export default class DocumentOutController {
    static async Search(req, res) {
        try {
            const search = req.query.search;
            const query = `SELECT * FROM document_out 
            INNER JOIN document_type on document_out.document_type_id COLLATE utf8mb4_general_ci = document_type.document_type_id
            INNER JOIN faculty on document_out.faculty_id COLLATE utf8mb4_general_ci = faculty.faculty_id
            WHERE document_out.numberID = ?`;
            // const values = [`%${search}%`];
            connected.query(query, [search], (err, result) => {
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
            const select = `select * from document_out 
            INNER JOIN document_type on document_out.document_type_id COLLATE utf8mb4_general_ci = document_type.document_type_id
            INNER JOIN faculty on document_out.faculty_id COLLATE utf8mb4_general_ci = faculty.faculty_id
            ORDER BY document_out.updatedAt DESC
            `;
            connected.query(select, (err, result) => {
                if (err) return SendError(res, 404, EMessage.ESelectAll, err);
                if (!result[0]) return SendError(res, 404, EMessage.NotFound);
                return SendSuccess(res, SMessage.SelectAll, result);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async SelectOne(req, res) {
        try {
            const document_out_id = req.params.document_out_id;
            if (!document_out_id) return SendError(res, 400, EMessage.BadRequest, "document_out_id");
            await FindOneDocumentOut(document_out_id);
            const select = `select * from document_out 
            INNER JOIN document_type on document_out.document_type_id COLLATE utf8mb4_general_ci = document_type.document_type_id
            INNER JOIN faculty on document_out.faculty_id COLLATE utf8mb4_general_ci = faculty.faculty_id WHERE document_out_id=?`;
            connected.query(select, document_out_id, (err, result) => {
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
            console.log(req.body);
            const { title, destinationName, destinationNumber, faculty_id, numberID, contactName, contactNumber, document_type_id, date, description, sendDoc } = req.body;
            const validate = await ValidateData({ title, faculty_id, destinationName, destinationNumber, numberID, contactName, contactNumber, document_type_id, date, description, sendDoc });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(","))
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
            const document_out_id = uuidv4();
            const insert = `insert into document_out (document_out_id, title, numberID,contactName,contactNumber,date,faculty_id,document_type_id,description,files,statusOut,destinationName,destinationNumber,sendDoc) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

            connected.query(insert, [document_out_id, title,
                numberID, contactName, contactNumber, date,
                faculty_id, document_type_id, description, files_url, FollowDocument.await, destinationName, destinationNumber, sendDoc], (err) => {
                    if (err) {
                        console.log("err1", err);
                        return SendError(res, 404, EMessage.EInsert, err);
                    }
                    const follow_document_out_id = uuidv4();
                    const datetime = new Date()
                    const insert2 = "insert into follow_document_out (follow_document_out_id,document_out_id,statusName,time) values (?,?,?,?)";
                    connected.query(insert2, [follow_document_out_id, document_out_id, FollowDocument.await, datetime], (err) => {
                        if (err) {
                            console.log("err2", err);
                            return SendError(res, 404, EMessage.EInsert, err)
                        };
                        return SendCreate(res, SMessage.Insert);
                    })
                    //return SendCreate(res, SMessage.Insert);
                })
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
    static async UpdateDocumentOut(req, res) {
        try {
            console.log(req.body);
            const document_out_id = req.params.document_out_id;
            console.log(document_out_id)
            if (!document_out_id) {
                console.log("A");
                return SendError(res, 400, EMessage.BadRequest, "document_out_id")
            };
            const document = await FindOneDocumentOut(document_out_id);
            const { title, numberID, destinationName, destinationNumber, faculty_id, contactName, contactNumber, document_type_id, date, description, sendDoc, statusOut } = req.body;
            const validate = await ValidateData({ title, numberID, faculty_id, contactName, contactNumber, document_type_id, date, destinationName, destinationNumber, sendDoc, statusOut });
            if (validate.length > 0) {
                console.log(validate)
                console.log("B");
                return SendError(res, 400, EMessage.BadRequest, validate.join(","))
            }
            const update = `Update document_out set title=?, numberID=?,contactName=?,contactNumber=?, date=?, faculty_id=?,document_type_id=?,description=? ,destinationName=?,destinationNumber=?,sendDoc=?,statusOut=? where document_out_id=?`
            connected.query(update, [title, numberID, contactName, contactNumber, date, faculty_id, document_type_id, description, destinationName, destinationNumber, sendDoc, statusOut, document_out_id], (err) => {
                if (err) {
                    console.log("c");
                    console.log(err);

                    return SendError(res, 404, EMessage.EUpdate, err);
                }
                const follow_document_out_id = uuidv4();
                const datetime = new Date()
                if (document.statusOut !== statusOut) {
                    const insert2 = "insert into follow_document_out (follow_document_out_id,document_out_id,statusName,time) values (?,?,?,?)";
                    connected.query(insert2, [follow_document_out_id, document_out_id, statusOut, datetime], (err) => {
                        console.log(err);
                        if (err) return SendError(res, 404, EMessage.EInsert, err);
                        return SendSuccess(res, SMessage.Update);
                    })
                } else {
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

            const document_out_id = req.params.document_out_id;
            console.log(document_out_id)
            if (!document_out_id) return SendError(res, 400, EMessage.BadRequest, "document_out_id");
            // await FindOneDocumentOut(document_out_id);
            const { status } = req.body;

            const update = `update document_out set  statusOut=? where document_out_id=?`;
            connected.query(update, [status, document_out_id], (err) => {
                if (err) return SendError(res, 404, EMessage.EUpdate, err);
                return SendSuccess(res, SMessage.Update);
            })
        } catch (error) {
            console.log(error)
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }


    static async DeleteDocumentOut(req, res) {
        try {
            const document_out_id = req.params.document_out_id;
            if (!document_out_id) return SendError(res, 400, EMessage.BadRequest, "document_out_id");
            await FindOneDocumentOut(document_out_id); (document_out_id);
            const deletedocument_out = "Delete from document_out where document_out_id=?";
            connected.query(deletedocument_out, document_out_id, (err) => {
                if (err) return SendError(res, 404, EMessage.EDelete, err);
                return SendSuccess(res, SMessage.Delete);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
}