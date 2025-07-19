import connected from "../config/db_mysql.js";
import { EMessage, SMessage } from "../service/message.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";
import { v4 as uuidv4, validate } from "uuid"

export default class FollowDocumentInController {
    static async SelectAll(req, res) {
        try {
            const select = `select * from follow_document_in
            INNER JOIN document_in on follow_document_in.document_in_id COLLATE utf8mb4_general_ci = document_in.document_in_id
            `;
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
            const follow_document_in_id = req.params.follow_document_in_id;
            if (!follow_document_in_id) return SendError(res, 400, EMessage.BadRequest, "follow_document_in_id");
           
            const select = `select * from follow_document_in 
            INNER JOIN document_in on follow_document_in.document_in_id COLLATE utf8mb4_general_ci = document_in.document_in_id
            where follow_document_in_id=?`;
            connected.query(select, follow_document_in_id, (err, result) => {
                if (err) return SendError(res, 404, EMessage.NotFound, err);
                if (!result[0]) return SendError(res, 404, EMessage.NotFound);
                return SendSuccess(res, SMessage.SelectOne, result[0]);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async SelectBy(req, res) {
        try {
            const document_in_id = req.params.document_in_id;
            if (!document_in_id) return SendError(res, 400, EMessage.BadRequest, "document_in_id");
            const select = `select * from follow_document_in 
            INNER JOIN document_in on follow_document_in.document_in_id COLLATE utf8mb4_general_ci = document_in.document_in_id
            where follow_document_in.document_in_id=?`;
            connected.query(select, document_in_id, (err, result) => {
                if (err) return SendError(res, 404, EMessage.NotFound, err);
                if (!result[0]) return SendError(res, 404, EMessage.NotFound);
                return SendSuccess(res, SMessage.SelectOne, result);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
    static async Insert(req, res) {
        try {
            const { document_in_id,statusName, time } = req.body;
            const validate = await ValidateData({ document_in_id,statusName, time })
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(','))
            }
            const follow_document_in_id = uuidv4();
            const insert = "insert into follow_document_in (follow_document_in_id,document_in_id,statusName,time) values (?,?,?,?)";
            connected.query(insert, [follow_document_in_id,document_in_id,statusName,time ], (err) => {
                if (err) return SendError(res, 404, EMessage.EInsert, err);
                return SendCreate(res, SMessage.Insert);
            })
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
    static async Update(req, res) {
        try {
            const follow_document_in_id = req.params.follow_document_in_id;
            if (!follow_document_in_id) return SendError(res, 400, EMessage.BadRequest, "follow_document_in_id");
            const { statusName, time } = req.body;
            const validate = await ValidateData({ statusName, time })
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest, validate.join(','))
            }
            const update = "update follow_document_in set statusName=?,time=? where follow_document_in_id=?";
            connected.query(update, [statusName, time, follow_document_in_id], (err) => {
                if (err) return SendError(res, 404, EMessage.EUpdate, err);
                return SendSuccess(res, SMessage.Update);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
    static async Delete(req, res) {
        try {
            const follow_document_in_id = req.params.follow_document_in_id;
            if (!follow_document_in_id) return SendError(res, 400, EMessage.BadRequest, "follow_document_in_id");
           
            const deletefollow_document_in = "Delete from follow_document_in where follow_document_in_id=?";
            connected.query(deletefollow_document_in, follow_document_in_id, (err) => {
                if (err) return SendError(res, 404, EMessage.EDelete, err);
                return SendSuccess(res, SMessage.Delete);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
}