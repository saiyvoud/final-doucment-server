import connected from "../config/db_mysql.js";
import { EMessage, SMessage } from "../service/message.js";
import { SendCreate, SendSuccess,SendError } from "../service/response.js";
import { v4 as uuidv4 } from "uuid"
import { ValidateData } from "../service/validate.js";
import { FindOnePermission, FindOneRole } from "../service/service.js";
export default class PermissionRoleController {
    static async SelectAll(req, res) {
        try {
            const selectAll = `select * from permission_role
            INNER JOIN role on permission_role.role_id COLLATE utf8mb4_general_ci = role.role_id`
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
            const { permission_id, role_id } = req.body;
            const validate = await ValidateData({ permission_id, role_id })
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(','));
            }
            await FindOneRole(role_id)
            await FindOnePermission(permission_id)
            const permission_role_id = uuidv4()
            const insert = `Insert into permission_role (permission_role_id,permission_id,role_id) values (?,?,?)`
            connected.query(insert, [permission_role_id,permission_id,role_id ], (err) => {
                if (err) return SendError(res, 404, EMessage.EInsert, err);
                return SendCreate(res, SMessage.Insert);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
}