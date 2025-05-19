const Mysql = require("mysql2");
const pool = Mysql.createPool({
    host: "localhost",
    user: "root",
    password: "3105",
    database: "movie"
})
const db = pool.promise()
module.exports = db