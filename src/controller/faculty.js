import connected from "../config/db_mysql.js";
import { EMessage, SMessage } from "../service/message.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";
import { v4 as uuidv4 } from "uuid"
import { FindOneFaculty, } from "../service/service.js";
export default class FacultController {
    static async SelectAll(req, res) {
        try {
            const slectAll = `select * from faculty`
            connected.query(slectAll, (err, result) => {
                if (err) return SendError(res, 404, EMessage.NotFound, err);
                if (!result[0]) return SendError(res, 404, EMessage.NotFound)
                return SendSuccess(res, SMessage.SelectAll, result);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async SelectOne(req, res) {
        try {
            const faculty_id = req.params.faculty_id;
            await FindOneFaculty(faculty_id);
            const selectOne = 'select * from faculty where faculty_id=?'
            connected.query(selectOne, faculty_id, (err, result) => {
                if (err) return SendError(res, 404, EMessage.ESelectOne, err);
                if (!result[0]) {
                    return SendError(res, 404, EMessage.NotFound);
                }
                return SendSuccess(res, SMessage.SelectOne, result[0]);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async Insert(req, res) {
        try {
            const { name, phoneNumber } = req.body;
            const validate = await ValidateData({ name, phoneNumber });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(","))
            }
            const faculty_id = uuidv4();
            const insert = "Insert into faculty (faculty_id,name,phoneNumber) values (?,?,?)";
            connected.query(insert, [
                faculty_id, name, phoneNumber,
            ], (err) => {
                if (err) return SendError(res, 404, EMessage.EInsert, err);
                return SendCreate(res, SMessage.Insert);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async UpdateFaculty(req, res) {
        try {
            const faculty_id = req.params.faculty_id;
            await FindOneFaculty(faculty_id);
            const { name, phoneNumber } = req.body;
            const validate = await ValidateData({ name, phoneNumber });

            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(","))
            }
            const update = "update faculty set name=? , phoneNumber=? where faculty_id=?";
            connected.query(update, [name, phoneNumber, faculty_id], (err) => {
                if (err) return SendError(res, 404, EMessage.NotFound, err);
                return SendSuccess(res, SMessage.Update);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async DeleteFaculty(req, res) {
        try {
            const faculty_id = req.params.faculty_id;
            await FindOneFaculty(faculty_id);
            const update = "Delete from faculty where faculty_id=?";
            connected.query(update, faculty_id, (err) => {
                if (err) return SendError(res, 404, EMessage.NotFound, err);
                return SendSuccess(res, SMessage.Delete);
            })
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
}