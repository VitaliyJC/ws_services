// hooks/useWebSocket.js
import { useEffect } from "react";

export default function useWebSocket(onTelemetry, onStatusUpdate) {
  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) return;

    const ws = new WebSocket(`ws://${window.location.host}/ws_socket?type=user&token=${token}`);
    // const ws = new WebSocket(`ws://localhost/ws_socket?type=user&token=${token}`);

    ws.onopen = () => {
      console.log("✅ WebSocket открыт");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "telemetry") {
        onTelemetry(data.deviceId, data.data); // передаём в callback
      }

      if (data.type === "status") {
        onStatusUpdate(data.deviceId, data.online, data.last_connected);
      }
    };

    ws.onclose = () => {
      console.log("❌ WebSocket закрыт");
    };

    ws.onerror = (err) => {
      console.error("🚨 WebSocket ошибка:", err);
    };

    return () => {
      ws.close();
    };
  }, [onTelemetry, onStatusUpdate]);
}
