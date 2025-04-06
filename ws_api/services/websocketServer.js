import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { pool } from "../db/db_init.js";
import { DeviceModel } from "../models/DeviceModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

// Хранилище подключений
const userClients = new Map(); // ws => { userId, deviceIds }
const deviceClients = new Map(); // ws => { deviceId }

export const setupWebSocket = (server) => {
  const wss = new WebSocketServer({ server, path: "/api/ws" });

  // Периодическая проверка
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) {
        console.log("Закрытие неответившего клиента");
        return ws.terminate(); // жёстко убить
      }

      ws.isAlive = false;
      ws.ping(); // посылаем ping
    });
  }, 10000); // каждые 10 секунд

  // Чистим интервал при остановке сервера
  process.on("SIGINT", () => {
    clearInterval(interval);
    console.log("WebSocket сервер остановлен");
    process.exit(0);
  });

  wss.on("connection", async (ws, req) => {
    ws.isAlive = true;

    ws.on("pong", () => {
      ws.isAlive = true;
    });

    const url = req.headers["x-original-uri"] || req.url;
    const params = new URLSearchParams(url.split("?")[1] || "");
    const token = params.get("token");
    const type = params.get("type"); // тип: 'user' или 'device'

    if (type === "user") {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        const result = await pool.query("SELECT id FROM devices WHERE user_id = $1", [userId]);
        const deviceIds = result.rows.map((row) => row.id);

        userClients.set(ws, { userId, deviceIds });
        ws.send(JSON.stringify({ type: "welcome", deviceIds }));

        console.log(`🔌 WebSocket-пользователь подключен: user_id=${userId}`);

        ws.on("close", () => {
          userClients.delete(ws);
          console.log(`❌ WebSocket-пользователь отключён: user_id=${userId}`);
        });
      } catch (err) {
        console.error("❌ JWT WebSocket auth error:", err.message);
        ws.close();
      }
    } else if (type === "device") {
      try {
        if (!token) throw new Error("Токен не передан");

        const result = await pool.query("SELECT device_id FROM device_tokens WHERE token = $1", [token]);
        if (result.rows.length === 0) throw new Error("Неверный токен устройства");

        const deviceId = result.rows[0].device_id;
        deviceClients.set(ws, { deviceId });

        ws.send(JSON.stringify({ type: "welcome", deviceId }));
        console.log(`📲 Устройство подключено: device_id=${deviceId}`);

        await DeviceModel.updateStatus(deviceId, "Подключено");
        // 🔁 Добавим deviceId всем user-клиентам, которые владеют этим устройством
        const ownerResult = await pool.query("SELECT user_id FROM devices WHERE id = $1", [deviceId]);
        const ownerUserId = ownerResult.rows[0]?.user_id;

        for (const [client, user] of userClients.entries()) {
          if (user.userId === ownerUserId && !user.deviceIds.includes(deviceId)) {
            user.deviceIds.push(deviceId);

            client.send(
              JSON.stringify({
                type: "newDeviceConnected",
                deviceId,
              })
            );

            console.log(`🆕 Устройство ${deviceId} добавлено к user_id=${ownerUserId}`);
          }
        }

        ws.on("close", async () => {
          deviceClients.delete(ws);
          console.log(`❌ Устройство отключилось: device_id=${deviceId}`);
          await DeviceModel.updateStatus(deviceId, "Отключено");

          const now = new Date().toISOString();

          // Уведомим всех клиентов, что оно оффлайн
          for (const [client, { deviceIds }] of userClients.entries()) {
            if (deviceIds.includes(deviceId)) {
              client.send(
                JSON.stringify({
                  type: "status",
                  deviceId,
                  online: false,
                  last_connected: now,
                })
              );
            }
          }
        });
      } catch (err) {
        console.error("❌ Device WebSocket auth error:", err.message);
        ws.close();
      }
    } else {
      ws.close();
    }
  });

  console.log("🚀 WebSocket-сервер инициализирован (user + device)");
};

// Позволяет из других модулей слать данные в сокет
export const broadcastToDevice = (deviceId, data) => {
  for (const [ws, { deviceIds }] of userClients.entries()) {
    if (deviceIds.includes(deviceId)) {
      ws.send(JSON.stringify({ type: "telemetry", deviceId, data }));
    }
  }
};

export const forceDisconnectDevice = (deviceId) => {
  console.log("deviceClients: ", deviceClients);

  for (const [ws, info] of deviceClients.entries()) {
    if (info.deviceId === deviceId) {
      ws.send(JSON.stringify({ type: "forceDisconnect" }));
      ws.close();
      deviceClients.delete(ws);
      console.log(`🔌 Устройство отключено принудительно: device_id=${deviceId}`);
    }
  }
};
