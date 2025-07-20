import mysql from "mysql";
const connected = mysql.createConnection({
    // host: "localhost",
    // user: "root",
    // password: "",
    // database: "db_document",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    host: "mysql-199842-0.cloudclusters.net",
    port: "16517",
    user: "admin",
    password: "mGkW3Tmk",
    database: "db_document"
});

connected.connect((err) => {
    if (err) console.log(`Faild Connect Database`, err);
    console.log(`Connected Database`);
})
export default connected;