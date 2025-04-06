import express from "express";
import { createServer } from "http";
import cors from "cors";

import { initDatabase } from "./db/initDb.js";

import userRoutes from "./routes/userRoutes.js";
import deviceTokenRoutes from "./routes/deviceTokenRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import telemetryRoutes from "./routes/telemetryRoutes.js";

import { setupWebSocket } from "./services/websocketServer.js";

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(cors());

await initDatabase();

app.use("/api/users", userRoutes);
app.use("/api/device-tokens", deviceTokenRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/telemetry", telemetryRoutes);

setupWebSocket(server);

const PORT = process.env.PORT || 4444;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
