import connected from "../config/db_mysql.js";
import { EMessage, SMessage } from "../service/message.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";
import { v4 as uuidv4 } from "uuid"
import { FindOnePartSuppile } from "../service/service.js";
export default class PartSuppileController {
    static async SelectAll(req, res) {
        try {
            const select = "select * from part_suppile";
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
            const part_suppile_id = req.params.part_suppile_id;
            if (!part_suppile_id) return SendError(res, 400, EMessage.BadRequest, "part_suppile_id");
            await FindOnePartSuppile(part_suppile_id);
            const select = "select * from part_suppile where part_suppile_id=?";
            connected.query(select, part_suppile_id, (err, result) => {
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
            const { part_suppile_name } = req.body;
            if (!part_suppile_name) {
                return SendError(res, 400, EMessage.BadRequest, "part_suppile_name")
            }
            const part_suppile_id = uuidv4();
            const insert = "insert into part_suppile (part_suppile_id,part_suppile_name) values (?,?)";
            connected.query(insert, [part_suppile_id, part_suppile_name], (err) => {
                if (err) return SendError(res, 404, EMessage.EInsert, err);
                return SendCreate(res, SMessage.Insert);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
    static async UpdatePartSuppile(req, res) {
        try {
            const part_suppile_id = req.params.part_suppile_id;
            if (!part_suppile_id) return SendError(res, 400, EMessage.BadRequest, "part_suppile_id");
            await FindOnePartSuppile(part_suppile_id);
            const { part_suppile_name } = req.body;
            if (!part_suppile_name) {
                return SendError(res, 400, EMessage.BadRequest, "part_suppile_name")
            }
            const update = "update part_suppile set part_suppile_name=? where part_suppile_id=?";
            connected.query(update, [part_suppile_name, part_suppile_id], (err) => {
                if (err) return SendError(res, 404, EMessage.EUpdate, err);
                return SendSuccess(res, SMessage.Update);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
    static async DeletePartSuppile(req, res) {
        try {
            const part_suppile_id = req.params.part_suppile_id;
            if (!part_suppile_id) return SendError(res, 400, EMessage.BadRequest, "part_suppile_id");
            await FindOnePartSuppile(part_suppile_id); (part_suppile_id);
            const deletepart_suppile = "Delete from part_suppile where part_suppile_id=?";
            connected.query(deletepart_suppile, part_suppile_id, (err) => {
                if (err) return SendError(res, 404, EMessage.EDelete, err);
                return SendSuccess(res, SMessage.Delete);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
}