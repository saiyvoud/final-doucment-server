import connected from "../config/db_mysql.js";
import { EMessage, SMessage } from "../service/message.js";
import { SendError, SendSuccess } from "../service/response.js";

export default async function Dashboard(req, res) {
    try {
        const sql = `
        SELECT 'total_in' AS type, COUNT(*) as number  FROM document_in
        UNION ALL
        SELECT 'total_out' AS type, COUNT(*) as number  FROM document_out 
        UNION ALL
        SELECT 'total_await' AS type, (
            SELECT COUNT(*) FROM document_in WHERE status NOT IN ('ກັບມາທີ່ພະແນກຂາເຂົ້າ-ຂາອອກ','ມາຮັບເອກະສານແລ້ວ')
            ) + (
            SELECT COUNT(*) FROM document_out WHERE statusOut NOT IN ('ກັບມາທີ່ພະແນກຂາເຂົ້າ-ຂາອອກ','ມາຮັບເອກະສານແລ້ວ')
            ) AS number
        UNION ALL
        SELECT 'total' AS type, (
            SELECT COUNT(*) FROM document_in 
            ) + (
            SELECT COUNT(*) FROM document_out
        ) AS number
        `;
        connected.query(sql, (err, resultCount) => {
            if (err) return SendError(res, 404, EMessage.ESelectAll, err);

            const sql = `
            SELECT * FROM document_in
            ORDER BY createdAt DESC
            LIMIT 5;
            `
            connected.query(sql, (err, last5docin) => {
                if (err) return SendError(res, 400, EMessage.ESelectAll, err);
                return SendSuccess(res, SMessage.SelectOne, { doc_count: resultCount, last_doc_in: last5docin });
            })

        });

    } catch (error) {
        return SendError(res, 500, EMessage.ServerInternal, error);
    }
}