import { pool } from "../db/db_init.js";
import crypto from "crypto";

export const DeviceTokenModel = {
  // Создать новый или обновить существующий токен
  async createOrUpdate(userId, deviceId) {
    // Проверка принадлежности устройства пользователю
    const deviceCheck = await pool.query("SELECT id FROM devices WHERE id = $1 AND user_id = $2", [deviceId, userId]);

    if (deviceCheck.rows.length === 0) {
      throw new Error("Устройство не найдено или не принадлежит вам");
    }

    const newToken = crypto.createHash("md5").update(Date.now().toString()).digest("hex");

    // Проверяем, существует ли токен
    const existing = await pool.query("SELECT id FROM device_tokens WHERE device_id = $1", [deviceId]);

    let token;

    if (existing.rows.length > 0) {
      // Обновляем токен в device_tokens
      const updated = await pool.query(
        `UPDATE device_tokens 
         SET token = $1, created_at = CURRENT_TIMESTAMP 
         WHERE device_id = $2 
         RETURNING *`,
        [newToken, deviceId]
      );

      token = updated.rows[0];
    } else {
      // Создаём новый токен
      const created = await pool.query(
        `INSERT INTO device_tokens (token, device_id) 
         VALUES ($1, $2) 
         RETURNING *`,
        [newToken, deviceId]
      );

      token = created.rows[0];

      // Привязываем его к устройству
      await pool.query(
        `UPDATE devices 
         SET device_token_id = $1 
         WHERE id = $2`,
        [token.id, deviceId]
      );
    }

    return token;
  },

  async getAllByUser(userId) {
    const result = await pool.query(
      `SELECT dt.* 
       FROM device_tokens dt
       JOIN devices d ON dt.device_id = d.id
       WHERE d.user_id = $1
       ORDER BY dt.created_at DESC`,
      [userId]
    );

    return result.rows;
  },

  async delete(tokenId, userId) {
    const result = await pool.query(
      `
      DELETE FROM device_tokens dt
      USING devices d
      WHERE dt.id = $1
        AND dt.device_id = d.id
        AND d.user_id = $2
      RETURNING dt.*
      `,
      [tokenId, userId]
    );

    return result.rows[0];
  },
};
