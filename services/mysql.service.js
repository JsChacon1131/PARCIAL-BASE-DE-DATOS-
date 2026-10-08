const mysql = require("mysql2/promise");
const { heritageConfig, bookingConfig } = require("../env/mysqlConfig");

const heritageDb = mysql.createPool(heritageConfig);
const bookingDb = mysql.createPool(bookingConfig);

module.exports = { heritageDb, bookingDb };
