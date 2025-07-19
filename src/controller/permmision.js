import connected from "../config/db_mysql.js";
import { EMessage, SMessage } from "../service/message.js";
import { SendCreate,SendSuccess, SendError } from "../service/response.js";
import { v4 as uuidv4 } from "uuid"
export default class PermissionController {
    static async SelectAll(req, res) {
        try {
            const selectAll = "select * from permission"
            connected.query(selectAll, (err, result) => {
                if (err) return SendError(res, 404, EMessage.NotFound, err);
                if (!result[0]) return SendError(res, 404, EMessage.NotFound);
                return SendSuccess(res, SMessage.SelectAll, result);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
    static async Insert(req, res) {
        try {
            const { permission_name } = req.body;
            if (!permission_name) {
                return SendError(res, 400, EMessage.BadRequest, "permission name");
            }
            const permission_id = uuidv4()
            const insert = `Insert into permission (permission_id,permission_name) values (?,?)`
            connected.query(insert, [permission_id, permission_name], (err) => {
                if (err) return SendError(res, 404, EMessage.EInsert, err);
                return SendCreate(res, SMessage.Insert);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
}