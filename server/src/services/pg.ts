import "dotenv/config";
import { Client } from "pg";

const client = new Client({
  host: process.env.HOST,
  user: process.env.DB_USER,
  port: Number(process.env.DB_PORT),
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default client;
