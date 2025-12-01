import mysql from "mysql2/promise";
import { config } from "../config.ts";

export const conn = async () => {
  return await mysql.createConnection({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE,
    port: config.DB_PORT,
  });
};
