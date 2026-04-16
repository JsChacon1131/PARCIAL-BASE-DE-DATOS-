const mysql = require("mysql2/promise");
const { patrimonioConfig, reservasConfig } = require("../env/mysqlConfig");

const patrimonioDb = mysql.createPool(patrimonioConfig);
const reservasDb = mysql.createPool(reservasConfig);

module.exports = { patrimonioDb, reservasDb };