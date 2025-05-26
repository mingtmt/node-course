"use strict";

const dev = {
  app: {
    port: process.env.DEV_APP_PORT,
  },
  db: {
    host: process.env.DEV_DB_HOST,
    name: process.env.DEV_DB_NAME,
    port: process.env.DEV_DB_PORT,
  },
};

const prod = {
  app: {
    port: process.env.PROD_APP_PORT,
  },
  db: {
    host: process.env.PROD_DB_HOST,
    name: process.env.PROD_DB_NAME,
    port: process.env.PROD_DB_PORT,
  },
};

const config = { dev, prod };
const env = process.env.NODE_ENV || "dev";
module.exports = config[env];
