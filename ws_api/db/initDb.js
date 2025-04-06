import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { pool } from "./db_init.js";

// Получаем путь к текущей директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function initDatabase() {
  const initSql = fs.readFileSync(path.join(__dirname, "init.sql")).toString();

  try {
    await pool.query(initSql);
    console.log("✅ Таблицы успешно созданы (или уже есть)");
  } catch (err) {
    console.error("❌ Ошибка при создании таблиц:", err.message);
  }
}
