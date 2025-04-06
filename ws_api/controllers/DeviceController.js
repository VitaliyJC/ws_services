import { DeviceModel } from "../models/DeviceModel.js";
import { forceDisconnectDevice } from "../services/websocketServer.js";

// Получить список устройств пользователя
export const getDevices = async (req, res) => {
  try {
    const devices = await DeviceModel.getAllByUser(req.user.id);
    res.json(devices);
  } catch (err) {
    console.error("❌ Ошибка получения устройств:", err);
    res.status(500).json({ message: "Не удалось получить список устройств" });
  }
};

// Создать новое устройство
export const createDevice = async (req, res) => {
  try {
    const userId = req.user.id;

    const device = await DeviceModel.create({
      user_id: userId,
      status: "Отключено",
    });

    res.status(201).json({
      message: "Устройство создано",
      device,
    });
  } catch (err) {
    console.error("❌ Ошибка создания устройства:", err);
    res.status(500).json({ message: "Не удалось создать устройство" });
  }
};

// Обновить статус устройства ("Подключено"/"Отключено")
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Подключено", "Отключено"].includes(status)) {
      return res.status(400).json({ message: "Недопустимый статус" });
    }

    const updated = await DeviceModel.updateStatus(id, status);
    res.json({
      message: "Статус обновлён",
      device: updated,
    });
  } catch (err) {
    console.error("❌ Ошибка обновления статуса:", err);
    res.status(500).json({ message: "Не удалось обновить статус" });
  }
};

// Удалить устройство
export const deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;
    forceDisconnectDevice(id);
    await DeviceModel.delete(id);
    res.json({ message: "Устройство удалено" });
  } catch (err) {
    console.error("❌ Ошибка удаления устройства:", err);
    res.status(500).json({ message: "Не удалось удалить устройство" });
  }
};
