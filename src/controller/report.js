import { SMessage, EMessage } from "../service/message.js";
import { SendError, SendSuccess } from "../service/response.js";
import connected from "../config/db_mysql.js";

export default class ReportController {
    static async reportPadding(req, res) {
        try {
            const sql = `select * from document_in 
            INNER JOIN part_demand on document_in.part_demand_id COLLATE utf8mb4_general_ci = part_demand.part_demand_id
            INNER JOIN faculty on document_in.faculty_id COLLATE utf8mb4_general_ci = faculty.faculty_id
            WHERE status = 'padding' OR status = 'await'
            Union All select * from document_out 
            INNER JOIN part_suppile on document_out.part_suppile_id COLLATE utf8mb4_general_ci = part_suppile.part_suppile_id
            INNER JOIN document_in on document_out.document_in_id COLLATE utf8mb4_general_ci = document_in.document_in_id
            INNER JOIN faculty on document_out.faculty_id COLLATE utf8mb4_general_ci = faculty.faculty_id
            WHERE status = 'padding' OR status = 'await'
            ORDER BY updatedAt DESC
            `

            connected.query(sql, (err, result) => {
                if (err) return SendError(res, 404, EMessage.ESelectAll, err);
                return SendSuccess(res, SMessage.SelectAll, result)

            });
        } catch (error) {
            console.log(error);
            return SendError(res, 500, EMessage.ServerInternal, error);
        }
    }
}