import express from "express";
import { DeviceController } from "../controllers/index.js";
import { checkAuth } from "../utils/checkAuth.js";

const router = express.Router();

// Получить список устройств текущего пользователя
router.get("/", checkAuth, DeviceController.getDevices);

// Создать новое устройство
router.post("/", checkAuth, DeviceController.createDevice);

// Обновить статус устройства (Подключено / Отключено)
router.put("/:id/status", checkAuth, DeviceController.updateStatus);

// Удалить устройство
router.delete("/:id", checkAuth, DeviceController.deleteDevice);

export default router;
