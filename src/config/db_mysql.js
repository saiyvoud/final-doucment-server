import mysql from "mysql";
// const connected = mysql.createConnection({
//     // host: "localhost",
//     // user: "root",
//     // password: "",
//     // database: "db_document",
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
//     host: "mysql-199842-0.cloudclusters.net",
//     port: "16517",
//     user: "admin",
//     password: "mGkW3Tmk",
//     database: "db_document"
// });


const connected = mysql.createPool({
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    host: "mysql-199842-0.cloudclusters.net",
    port: "16517",
    user: "admin",
    password: "mGkW3Tmk",
    database: "db_document"
});

// Test connection with a simple query
connected.getConnection((err, connection) => {
    if (err) {
        console.error("Failed to connect to database:", err);
    } else {
        console.log("Connected to database");
        connection.release(); // release back to pool
    }
});

export default connected;
