import express from "express"; // es
import cors from "cors";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import "./config/db_mysql.js"
import router from "./router/route.js";
import { PORT } from "./config/globalKey.js";
import morgan from 'morgan';
const app = express();
app.use(morgan('dev'));
app.use(cors()); // ໃຫ້ສາມາດຮັບ Request ຫລື ຮັບຂໍ້ມູນຈາກ Client ຫລື front end ຫລື ແອັບ ໄດ້
app.use(fileUpload()); // ໄວ້ upload file ຜ່ານ formData
//--- bodyParser ແມ່ນປະກາດເພື່ອໄວ້ຮັບຄ່າຈາກ client ແລະ response ເປັນ json
app.use(bodyParser.json({ extended: true, limit: "500mb", parameterLimit: 500 }));
app.use(bodyParser.urlencoded({ extended: true, limit: "500mb", parameterLimit: 500 }));
app.use("/api",router) // http://localhost:3000/api/
// --- app.listen ແມ່ນ method ໃຊ້ສຳຫລັບການທຳງານຂອງ back end server
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})