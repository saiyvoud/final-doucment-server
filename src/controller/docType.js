import connected from "../config/db_mysql.js";
import { EMessage, SMessage } from "../service/message.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";
import { v4 as uuidv4 } from "uuid"
import { FindOneDocumentType } from "../service/service.js";

export default class DocumentTypeController {
    static async SelectAll(req, res) {
        try {
            const select = "select * from document_type";
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
            const document_type_id = req.params.document_type_id;
            if (!document_type_id) return SendError(res, 400, EMessage.BadRequest, "document_type_id");
            await FindOnedocument_type(document_type_id);
            const select = "select * from document_type where document_type_id=?";
            connected.query(select, document_type_id, (err, result) => {
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
            const { docName } = req.body;
            if (!docName) {
                return SendError(res, 400, EMessage.BadRequest, "docName")
            }
            const document_type_id = uuidv4();
            const insert = "insert into document_type (document_type_id,docName) values (?,?)";
            connected.query(insert, [document_type_id, docName], (err) => {
                if (err) return SendError(res, 404, EMessage.EInsert, err);
                return SendCreate(res, SMessage.Insert);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
    static async UpdateDocumentType(req, res) {
        try {
            const document_type_id = req.params.document_type_id;
            if (!document_type_id) return SendError(res, 400, EMessage.BadRequest, "document_type_id");
            await FindOneDocumentType(document_type_id);
            const { docName } = req.body;
            if (!docName) {
                return SendError(res, 400, EMessage.BadRequest, "docName")
            }
            const update = "update document_type set docName=? where document_type_id=?";
            connected.query(update, [docName, document_type_id], (err) => {
                if (err) return SendError(res, 404, EMessage.EUpdate, err);
                return SendSuccess(res, SMessage.Update);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
    static async DeleteDocumentType(req, res) {
        try {
            const document_type_id = req.params.document_type_id;
            if (!document_type_id) return SendError(res, 400, EMessage.BadRequest, "document_type_id");
            await FindOneDocumentType(document_type_id);
            const deletedocument_type = "Delete from document_type where document_type_id=?";
            connected.query(deletedocument_type, document_type_id, (err) => {
                if (err) return SendError(res, 404, EMessage.EDelete, err);
                return SendSuccess(res, SMessage.Delete);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
}