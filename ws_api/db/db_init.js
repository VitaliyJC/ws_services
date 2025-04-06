import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
export const pool = new Pool({
  host: process.env.POSTGRES_HOST || "ws_postgresql",
  port: process.env.POSTGRES_PORT || "5432",
  user: process.env.POSTGRES_USER || "ws_user",
  password: process.env.POSTGRES_PASSWORD || "ws_secret",
  database: process.env.POSTGRES_DB || "ws_db",
});
