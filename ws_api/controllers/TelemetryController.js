import { TelemetryModel } from "../models/TelemetryModel.js";
import { broadcastToDevice } from "../services/websocketServer.js";
import { pool } from "../db/db_init.js";

// Добавить новую запись телеметрии
export const createTelemetry = async (req, res) => {
  try {
    const { device_id, voltage, temperature } = req.body;

    if (!device_id || voltage == null || temperature == null) {
      return res.status(400).json({ message: "Все поля обязательны" });
    }

    const entry = await TelemetryModel.create({ device_id, voltage, temperature });

    // Отправка в WebSocket
    broadcastToDevice(device_id, {
      voltage,
      temperature,
      timestamp: entry.timestamp,
    });

    res.status(201).json({
      message: "Запись телеметрии добавлена",
      data: entry,
    });
  } catch (err) {
    console.error("❌ Ошибка при добавлении телеметрии:", err);
    res.status(500).json({ message: "Не удалось добавить телеметрию" });
  }
};

// Получить последние данные устройства
export const getLatestTelemetry = async (req, res) => {
  try {
    const { device_id } = req.params;

    // Проверка владельца
    const device = await pool.query("SELECT id FROM devices WHERE id = $1 AND user_id = $2", [device_id, req.user.id]);
    if (device.rows.length === 0) {
      return res.status(403).json({ message: "Устройство не принадлежит вам" });
    }

    const data = await TelemetryModel.getLatestByDeviceId(device_id);
    if (!data) {
      return res.status(404).json({ message: "Данные не найдены" });
    }

    res.json(data);
  } catch (err) {
    console.error("❌ Ошибка при получении последних данных:", err);
    res.status(500).json({ message: "Ошибка получения телеметрии" });
  }
};

// Получить последние N записей
export const getRecentTelemetry = async (req, res) => {
  try {
    // Проверка владельца
    const device = await pool.query("SELECT id FROM devices WHERE id = $1 AND user_id = $2", [device_id, req.user.id]);
    if (device.rows.length === 0) {
      return res.status(403).json({ message: "Устройство не принадлежит вам" });
    }

    const { device_id } = req.params;
    const limit = parseInt(req.query.limit) || 20;

    const data = await TelemetryModel.getRecentByDeviceId(device_id, limit);
    res.json(data);
  } catch (err) {
    console.error("❌ Ошибка при получении списка телеметрии:", err);
    res.status(500).json({ message: "Ошибка получения телеметрии" });
  }
};

// Получить записи по периоду
export const getTelemetryByPeriod = async (req, res) => {
  try {
    // Проверка владельца
    const device = await pool.query("SELECT id FROM devices WHERE id = $1 AND user_id = $2", [device_id, req.user.id]);
    if (device.rows.length === 0) {
      return res.status(403).json({ message: "Устройство не принадлежит вам" });
    }

    const { device_id } = req.params;
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: "Параметры from и to обязательны" });
    }

    const data = await TelemetryModel.getByPeriod(device_id, from, to);
    res.json(data);
  } catch (err) {
    console.error("❌ Ошибка при фильтрации по дате:", err);
    res.status(500).json({ message: "Ошибка получения телеметрии" });
  }
};
