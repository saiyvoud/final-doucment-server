import connected from "../config/db_mysql.js";
import { EMessage, SMessage } from "../service/message.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";
import { v4 as uuidv4 } from "uuid"
import { DecryptData, EncryptData, FindOneEmail, FindOneUser, GenerateToken } from "../service/service.js";
export default class UserController {
    static async Register(req, res) {
        try {
            const { username, email, password, phoneNumber, faculty_id, office_id } = req.body;
            const validate = await ValidateData({
                username, email, password,
                phoneNumber,
            });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(","));
            }
            const generatePassword = await EncryptData(password);
            if (!generatePassword) {
                return SendError(res, 404, EMessage.NotFound)
            }
            const user_id = uuidv4()
            const insert = `Insert into user 
            (user_id,username,email,password,phone_number,faculty_id,office_id) values (?,?,?,?,?,?,?)`
            connected.query(insert, [user_id, username, email, generatePassword,
                phoneNumber, faculty_id, office_id,], (err) => {
                    if (err) {
                        return SendError(res, 404, EMessage.EInsert, err);
                    }
                    return SendCreate(res, SMessage.Register);
                })
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async Login(req, res) {
        try {
            const { email, password } = req.body;
            const validate = await ValidateData({ email, password });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(","));
            }
            const user = await FindOneEmail(email);
            // console.log(user)
            const decode = await DecryptData(user.password);
            if (password !== decode) {
                return SendError(res, 404, EMessage.NotMatch);
            }
            user.password = undefined;

            //get role & permission
            const sql = `
            SELECT 
                u.user_id,
                u.username,
                u.email,
                ru.role_id AS role_id,
                r.name AS role_name,
                GROUP_CONCAT(p.permission_name) AS permissions
                FROM 
                    user u
                LEFT JOIN 
                    role_user ru ON u.user_id = ru.user_id
                LEFT JOIN 
                    permission_user pu ON u.user_id = pu.user_id
                LEFT JOIN 
	                permission p ON p.permission_id = pu.permission_id
                LEFT JOIN
	                role r ON r.role_id = ru.role_id
                WHERE u.user_id = ?
                GROUP BY 
                    u.user_id,
                    u.username,
                    ru.role_id,
                    u.email
            `
            connected.query(sql, [user?.user_id], async (err, result) => {
                console.log(result)
                if (err) return SendError(res, 404, EMessage.NotFound, err);
                if (!result[0]) return SendError(res, 404, EMessage.NotFound)
                const token = await GenerateToken(user.user_id);
                const data = {
                    "user_id": result[0]?.user_id,
                    "username": result[0]?.username,
                    "email": result[0]?.email,
                    "role_id": result[0]?.role_id,
                    "role_name": result[0]?.role_name,
                    "permissions": result[0]?.permissions,
                    "refreshToken": token?.refreshToken,
                    "token": token?.token,
                    "refreshTokenExpireAt": token?.refreshTokenExpireAt,
                    "tokenExpireAt": token?.tokenExpireAt
                }
                 return SendSuccess(res, SMessage.Login, data)
            })

        } catch (error) {
            console.log(error)
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async SelectAll(req, res) {
        try {
            const slectAll = `SELECT user.user_id, user.username, user.email,user.phone_number,faculty.faculty_id,faculty.name as 'faculty_name',office.office_id,office.office_name FROM user
                    LEFT JOIN faculty on faculty.faculty_id = user.faculty_id
                    LEFT JOIN office on office.office_id = user.office_id`
            connected.query(slectAll, (err, result) => {
                if (err) return SendError(res, 404, EMessage.NotFound, err);
                if (!result[0]) return SendError(res, 404, EMessage.NotFound)
                return SendSuccess(res, SMessage.SelectAll, result);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async UpdateUser(req, res) {
        try {
            // console.log(req.body)
            const user_id = req.params.user_id;
            if (!user_id) return SendError(res, 400, EMessage.BadRequest, "user_id");
            const user = await FindOneUser(user_id);
            const { username, email, password, phone_number, faculty_id, office_id } = req.body;

            var pass = ""
            if (!password || password === "") {
                pass = user.password
            } else {
                pass = await EncryptData(password);
            }
            const update = "update user set username=?, email=?,password=?,phone_number=?,faculty_id=?, office_id=? where user_id=?";
            connected.query(update, [username, email, pass, phone_number, faculty_id, office_id, user_id], (err) => {
                if (err) return SendError(res, 404, EMessage.EUpdate, err);
                return SendSuccess(res, SMessage.Update);
            })
        } catch (error) {
            console.log(error)
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
    static async SelectAllUserWithRoleAndPermission(req, res) {
        try {
            const slectAll = `
            SELECT 
                u.user_id,
                u.username,
                u.email,
                ru.role_id AS role_id,
                r.name AS role_name,
                GROUP_CONCAT(p.permission_name) AS permissions
                FROM 
                    user u
                LEFT JOIN 
                    role_user ru ON u.user_id = ru.user_id
                LEFT JOIN 
                    permission_user pu ON u.user_id = pu.user_id
                LEFT JOIN 
	                permission p ON p.permission_id = pu.permission_id
                LEFT JOIN
	                role r ON r.role_id = ru.role_id
                GROUP BY 
                    u.user_id,
                    u.username,
                    ru.role_id,
                    u.email
            `
            connected.query(slectAll, (err, result) => {
                if (err) return SendError(res, 404, EMessage.NotFound, err);
                if (!result[0]) return SendError(res, 404, EMessage.NotFound)
                return SendSuccess(res, SMessage.SelectAll, result);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
}