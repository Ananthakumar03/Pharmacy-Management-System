const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    connectTimeout: 20000,

    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,

    // Idle connection-ah munnadiye close pannidum (stale connection varaadhu)
    maxIdle: 2,
    idleTimeout: 60000
});

// ---------- Auto retry for dropped connections ----------
const RETRY_CODES = [
    "PROTOCOL_CONNECTION_LOST",
    "ECONNRESET",
    "ETIMEDOUT",
    "EPIPE",
    "ECONNREFUSED",
    "ER_CON_COUNT_ERROR"
];

const originalQuery = db.query.bind(db);

db.query = function (sql, params, cb) {
    if (typeof params === "function") {
        cb = params;
        params = undefined;
    }

    const run = (retriesLeft) => {
        const done = (err, results, fields) => {
            if (err && RETRY_CODES.includes(err.code) && retriesLeft > 0) {
                console.log(`DB retry (${err.code}), left: ${retriesLeft}`);
                return setTimeout(() => run(retriesLeft - 1), 700);
            }
            if (cb) cb(err, results, fields);
        };

        if (params !== undefined) {
            originalQuery(sql, params, done);
        } else {
            originalQuery(sql, done);
        }
    };

    run(3);
};

// ---------- Keep connections warm ----------
setInterval(() => {
    originalQuery("SELECT 1", (err) => {
        if (err) console.log("DB keep-alive ping failed:", err.code || err.message);
    });
}, 4 * 60 * 1000);

db.getConnection((err, connection) => {
    if (err) {
        console.log("Database connection failed:", err.message);
    } else {
        console.log("MySQL Database Connected");
        connection.release();
    }
});

module.exports = db;