import { EMessage, SMessage } from "../service/message.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";
import { v4 as uuidv4 } from "uuid"
import connected from "../config/db_mysql.js";
import { FindOneRole, FindOneUser } from "../service/service.js";
export default class RoleUserController {
    static async SelectAll(req, res) {
        try {
            const slectAll = `select * from role_user
            RIGHT JOIN role on role_user.role_id COLLATE utf8mb4_general_ci = role.role_id
            RIGHT JOIN user on role_user.user_id COLLATE utf8mb4_general_ci = user.user_id`
            connected.query(slectAll, (err, result) => {
                if (err) return SendError(res, 404, EMessage.NotFound, err);
                if (!result[0]) return SendError(res, 404, EMessage.NotFound)
                return SendSuccess(res, SMessage.SelectAll, result);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async Insert(req, res) {
        try {
            const { role_id, user_id } = req.body;
            const validate = await ValidateData({ role_id, user_id });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(','))
            }
            await FindOneRole(role_id);
            await FindOneUser(user_id);
            const role_user_id = uuidv4();
            const insert = "insert into role_user (role_user_id,role_id,user_id) values (?,?,?)";
            connected.query(insert, [role_user_id, role_id, user_id], (err) => {
                if (err) return SendError(res, 404, EMessage.EInsert, err);
                return SendCreate(res, SMessage.Insert);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async Update(req, res) {
        try {
            const { role_id, user_id } = req.body;
            const validate = await ValidateData({ role_id, user_id });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(','))
            }
            //check role_user
            const SQL_role_user = `SELECT * FROM role_user WHERE user_id =?`;
            connected.query(SQL_role_user, [user_id], (err, result) => {
                if (err) return SendError(res, 404, EMessage.ESelectOne, err);

                // add new role_user
                if (!result[0]) {
                    const role_user_id = uuidv4();
                    const SQL_add_role_user = `INSERT INTO role_user (role_user_id,user_id, role_id) VALUES (?,?, ?)`;
                    connected.query(SQL_add_role_user, [role_user_id, user_id, role_id], (err) => {
                        if (err) return SendError(res, 404, EMessage.EInsert, err);
                        return SendSuccess(res, SMessage.Update);
                    });

                //update role_user
                } else {
                    const SQL_update_role_user = `UPDATE role_user SET role_id=? WHERE role_user_id = ?`;
                    connected.query(SQL_update_role_user, [role_id,result[0].role_user_id], (err) => {
                        if (err) return SendError(res, 404, EMessage.EUpdate, err);
                        return SendSuccess(res, SMessage.Update);
                    });
                }
            });

        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
}