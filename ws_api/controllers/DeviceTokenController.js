import { DeviceTokenModel } from "../models/DeviceTokenModel.js";
import { forceDisconnectDevice } from "../services/websocketServer.js";

export const createOrUpdateToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const deviceId = req.body.deviceId;

    if (!deviceId) {
      return res.status(400).json({ message: "Не указан ID устройства" });
    }

    console.log(deviceId);

    forceDisconnectDevice(deviceId);

    const token = await DeviceTokenModel.createOrUpdate(userId, deviceId);

    res.status(200).json({
      message: "Токен создан или обновлён и привязан к устройству",
      token,
    });
  } catch (err) {
    console.error("❌ Ошибка:", err.message);
    res.status(400).json({ message: err.message || "Не удалось создать или обновить токен" });
  }
};

// Получить все токены пользователя
export const getTokens = async (req, res) => {
  try {
    const userId = req.user.id;
    const tokens = await DeviceTokenModel.getAllByUser(userId);
    res.json({ tokens });
  } catch (err) {
    console.error("❌ Ошибка получения токенов:", err);
    res.status(500).json({ message: "Не удалось получить токены" });
  }
};

// Удалить токен
export const deleteToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const tokenId = parseInt(req.params.id);
    const deleted = await DeviceTokenModel.delete(tokenId, userId);

    if (!deleted) {
      return res.status(404).json({ message: "Токен не найден или не принадлежит вам" });
    }

    res.json({ message: "Токен удален", token: deleted });
  } catch (err) {
    console.error("❌ Ошибка удаления токена:", err);
    res.status(500).json({ message: "Не удалось удалить токен" });
  }
};
