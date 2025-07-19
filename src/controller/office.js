import connected from "../config/db_mysql.js";
import { EMessage, SMessage } from "../service/message.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";
import { v4 as uuidv4 } from "uuid"
import { DecryptData, EncryptData, FindOneEmail, FindOneFaculty, FindOneOffice, GenerateToken } from "../service/service.js";
export default class OfficeController {
    static async SelectAll(req, res) {
        try {
            const select = "select * from office";
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
            const office_id = req.params.office_id;
            if (!office_id) return SendError(res, 400, EMessage.BadRequest, "office_id");
            await FindOneOffice(office_id);
            const select = "select * from office where office_id=?";
            connected.query(select, office_id, (err, result) => {
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
            const { office_name } = req.body;
            if (!office_name) {
                return SendError(res, 400, EMessage.BadRequest, "office_name")
            }
            const office_id = uuidv4();
            const insert = "insert into office (office_id,office_name) values (?,?)";
            connected.query(insert, [office_id, office_name], (err) => {
                if (err) return SendError(res, 404, EMessage.EInsert, err);
                return SendCreate(res, SMessage.Insert);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
    static async UpdateOffice(req, res) {
        try {
            const office_id = req.params.office_id;
            if (!office_id) return SendError(res, 400, EMessage.BadRequest, "office_id");
            await FindOneOffice(office_id);
            const { office_name } = req.body;
            if (!office_name) {
                return SendError(res, 400, EMessage.BadRequest, "office_name")
            }
            const update = "update office set office_name=? where office_id=?";
            connected.query(update, [office_name, office_id], (err) => {
                if (err) return SendError(res, 404, EMessage.EUpdate, err);
                return SendSuccess(res, SMessage.Update);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
    static async DeleteOffice(req, res) {
        try {
            const office_id = req.params.office_id;
            if (!office_id) return SendError(res, 400, EMessage.BadRequest, "office_id");
            await FindOneOffice(office_id);
            const deleteOffice = "Delete from office where office_id=?";
            connected.query(deleteOffice, office_id, (err) => {
                if (err) return SendError(res, 404, EMessage.EDelete, err);
                return SendSuccess(res, SMessage.Delete);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
}