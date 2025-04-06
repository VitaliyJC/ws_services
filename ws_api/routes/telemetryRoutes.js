import express from "express";
import { TelemetryController } from "../controllers/index.js";
import { checkAuth } from "../utils/checkAuth.js";

const router = express.Router();

// Добавление новой записи телеметрии
router.post("/", TelemetryController.createTelemetry);

// Получить последние N записей
router.get("/:device_id/recent", checkAuth, TelemetryController.getRecentTelemetry);

// Получить последнюю запись
router.get("/:device_id/latest", checkAuth, TelemetryController.getLatestTelemetry);

// Получить записи по периоду
// Пример: /api/telemetry/1/period?from=2025-04-01&to=2025-04-02
router.get("/:device_id/period", checkAuth, TelemetryController.getTelemetryByPeriod);

export default router;
