import { pool } from "../db/db_init.js";

export const DeviceModel = {
  async getAllByUser(userId) {
    const result = await pool.query(
      `
      SELECT 
        d.id, 
        d.user_id, 
        d.status, 
        d.last_connected, 
        d.device_token_id,
        t.token AS device_token,
        t.created_at AS token_created_at
      FROM devices d
      LEFT JOIN device_tokens t ON d.device_token_id = t.id
      WHERE d.user_id = $1
      ORDER BY d.id DESC
      `,
      [userId]
    );

    return result.rows;
  },

  // Создать новое устройство
  async create({ user_id, status }) {
    const result = await pool.query(
      `INSERT INTO devices (user_id, status, last_connected) 
     VALUES ($1, $2, NULL) RETURNING *`,
      [user_id, status]
    );

    return result.rows[0];
  },

  // Обновить статус устройства
  async updateStatus(deviceId, status) {
    const now = new Date();

    if (status === "Отключено") {
      await pool.query(`UPDATE devices SET status = $1, last_connected = $2 WHERE id = $3`, [status, now.toISOString(), deviceId]);
    } else {
      await pool.query(`UPDATE devices SET status = $1 WHERE id = $2`, [status, deviceId]);
    }
  },

  // Удалить устройство
  async delete(deviceId) {
    const result = await pool.query(`DELETE FROM devices WHERE id = $1`, [deviceId]);

    return result.rowCount > 0;
  },

  // Найти устройство по токену
  async findByToken(token) {
    const result = await pool.query(
      `
      SELECT d.*
      FROM devices d
      INNER JOIN device_tokens t ON t.id = d.device_token_id
      WHERE t.token = $1
      `,
      [token]
    );

    return result.rows[0] || null;
  },
};
