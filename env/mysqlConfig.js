const sharedConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || ""
};

const heritageConfig = {
  ...sharedConfig,
  database: process.env.HERITAGE_DB_NAME || "db_patrimonio"
};

const bookingConfig = {
  ...sharedConfig,
  database: process.env.BOOKING_DB_NAME || "db_reservas"
};

module.exports = { heritageConfig, bookingConfig };
