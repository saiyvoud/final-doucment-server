import { EMessage, SMessage } from "../service/message.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { v4 as uuidv4 } from "uuid";
import connected from "../config/db_mysql.js";
export default class RoleController {
    static async SelectAll(req, res) {
        try {
            const selectAll = "select * from role"
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
            const { name } = req.body;
            if (!name) return SendError(res, 400, EMessage.BadRequest, "name");
            const role_id = uuidv4()
            const insert = "Insert into role (role_id,name) values(?,?)";
            connected.query(insert, [role_id, name], (err) => {
                if (err) return SendError(res, 404, EMessage.EInsert, err);
                return SendCreate(res, SMessage.Insert);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
}