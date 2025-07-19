import connected from "../config/db_mysql.js";
import { EMessage, SMessage } from "../service/message.js";
import { SendCreate, SendSuccess, SendError } from "../service/response.js";
import { v4 as uuidv4 } from "uuid"
import { ValidateData } from "../service/validate.js";

export default class PermissionUserController {
    static async Update(req, res) {
        const { user_id, permission_name } = req.body;
        const validate = await ValidateData({ user_id, permission_name });
        if (validate.length > 0) {
            return SendError(res, 400, EMessage.BadRequest, validate.join(','))
        }

        //find permiision 
        const SQL_find_permission = "SELECT * FROM permission WHERE permission_name = ?";
        connected.query(SQL_find_permission, [permission_name], (err, permission) => {
            if (err) return SendError(res, 404, EMessage.ESelectOne, err);

            //find_permission_user
            if (permission[0]) {
                const permission_id = permission[0].permission_id;
                const SQL_find = "SELECT * FROM permission_user WHERE permission_id=? AND user_id=? ";
                connected.query(SQL_find, [permission_id, user_id], (err, permission_user) => {
                    if (err) return SendError(res, 404, EMessage.ESelectOne, err);

                    //if permission_user is exits will delete
                    if (permission_user[0]) {
                        const SQL_delete = "DELETE FROM permission_user WHERE permission_user_id = ?"
                        connected.query(SQL_delete, [permission_user[0].permission_user_id], (err) => {
                            if (err) return SendError(res, 404, EMessage.EDelete, err);
                            return SendSuccess(res, SMessage.Update);
                        });
                    } else {
                        const id = uuidv4();
                        const SQL_insert = "INSERT INTO permission_user(permission_user_id, permission_id, user_id) VALUES(?,?,?)"
                        connected.query(SQL_insert, [id,permission_id,user_id], (err) => {
                            if (err) return SendError(res, 404, EMessage.EDelete, err);
                            return SendSuccess(res, SMessage.Update);
                        });
                    }

                });
                // return SendSuccess(res, SMessage.Insert);
            }

        });

    }
}