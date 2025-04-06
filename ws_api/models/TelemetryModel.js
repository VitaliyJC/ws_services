// models/TelemetryModel.js
import { pool } from "../db/db_init.js";

export const TelemetryModel = {
  async create({ device_id, voltage, temperature }) {
    const result = await pool.query(
      `INSERT INTO telemetry (device_id, voltage, temperature)
       VALUES ($1, $2, $3)
       RETURNING id, device_id, voltage, temperature, timestamp`,
      [device_id, voltage, temperature]
    );
    return result.rows[0];
  },

  async getLatestByDeviceId(device_id) {
    const result = await pool.query(
      `SELECT id, device_id, voltage, temperature, timestamp
       FROM telemetry
       WHERE device_id = $1
       ORDER BY timestamp DESC
       LIMIT 1`,
      [device_id]
    );
    return result.rows[0] || null;
  },

  async getRecentByDeviceId(device_id, limit = 20) {
    const result = await pool.query(
      `SELECT id, device_id, voltage, temperature, timestamp
       FROM telemetry
       WHERE device_id = $1
       ORDER BY timestamp DESC
       LIMIT $2`,
      [device_id, limit]
    );
    return result.rows;
  },

  async getByPeriod(device_id, from, to) {
    const result = await pool.query(
      `SELECT id, device_id, voltage, temperature, timestamp
       FROM telemetry
       WHERE device_id = $1 AND timestamp BETWEEN $2 AND $3
       ORDER BY timestamp DESC`,
      [device_id, from, to]
    );
    return result.rows;
  },
};
