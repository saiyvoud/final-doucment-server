import connected from "../config/db_mysql.js";
import { EMessage, SMessage } from "../service/message.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";
import { v4 as uuidv4 } from "uuid"
import {FindOnePartDemand} from "../service/service.js";
export default class PartDemandController {
    static async SelectAll(req, res) {
        try {
            const select = "select * from part_demand";
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
            const part_demand_id = req.params.part_demand_id;
            if (!part_demand_id) return SendError(res, 400, EMessage.BadRequest, "part_demand_id");
            await FindOnePartDemand(part_demand_id);
            const select = "select * from part_demand where part_demand_id=?";
            connected.query(select, part_demand_id, (err, result) => {
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
            const { part_demand_name } = req.body;
            if (!part_demand_name) {
                return SendError(res, 400, EMessage.BadRequest, "part_demand_name")
            }
            const part_demand_id = uuidv4();
            const insert = "insert into part_demand (part_demand_id,part_demand_name) values (?,?)";
            connected.query(insert, [part_demand_id, part_demand_name], (err) => {
                if (err) return SendError(res, 404, EMessage.EInsert, err);
                return SendCreate(res, SMessage.Insert);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
    static async UpdatePartDemand(req, res) {
        try {
            const part_demand_id = req.params.part_demand_id;
            if (!part_demand_id) return SendError(res, 400, EMessage.BadRequest, "part_demand_id");
            await FindOnePartDemand(part_demand_id);
            const { part_demand_name } = req.body;
            if (!part_demand_name) {
                return SendError(res, 400, EMessage.BadRequest, "part_demand_name")
            }
            const update = "update part_demand set part_demand_name=? where part_demand_id=?";
            connected.query(update, [part_demand_name, part_demand_id], (err) => {
                if (err) return SendError(res, 404, EMessage.EUpdate, err);
                return SendSuccess(res, SMessage.Update);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
    static async DeletePartDemend(req, res) {
        try {
            const part_demand_id = req.params.part_demand_id;
            if (!part_demand_id) return SendError(res, 400, EMessage.BadRequest, "part_demand_id");
            await FindOnePartDemand(part_demand_id);(part_demand_id);
            const deletepart_demand = "Delete from part_demand where part_demand_id=?";
            connected.query(deletepart_demand, part_demand_id, (err) => {
                if (err) return SendError(res, 404, EMessage.EDelete, err);
                return SendSuccess(res, SMessage.Delete);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.ServerInternal, error)
        }
    }
}