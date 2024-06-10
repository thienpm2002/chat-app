const mysql = require('mysql2/promise');
require('dotenv').config();


const pool = mysql.createPool({
     host: process.env.HOST_DB,
     user: process.env.USER_DB,
     password: process.env.PASSWORD_DB,
     database: process.env.NAME_DB
})

module.exports =  pool ;