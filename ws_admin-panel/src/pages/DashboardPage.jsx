import { useEffect, useState, useCallback } from "react";
import api from "../utils/axios";
import Device from "../components/Device";
import useWebSocket from "../hooks/useWebSocket";

export default function DashboardPage() {
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState("");

  // ✅ Фиксируем функции
  const handleTelemetry = useCallback((deviceId, telemetry) => {
    setDevices((prevDevices) => prevDevices.map((d) => (d.id === deviceId ? { ...d, telemetry, online: true } : d)));
  }, []);

  const handleOnlineStatus = useCallback((deviceId, online, last_connected) => {
    setDevices((prevDevices) => prevDevices.map((d) => (d.id === deviceId ? { ...d, online, telemetry: online ? d.telemetry : null, last_online: last_connected || d.last_connected } : d)));
  }, []);

  // ✅ WebSocket работает только 1 раз
  useWebSocket(handleTelemetry, handleOnlineStatus);

  const fetchDevices = async () => {
    try {
      const res = await api.get("/devices");
      setDevices(res.data);
    } catch (err) {
      console.error(err);
      setError("Ошибка при загрузке устройств");
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const onClickAddDevice = async () => {
    await api.post("/devices");

    await fetchDevices();
  };

  return (
    <div className="p-4">
      <div className="flex gap-5 mb-4 text-center items-center">
        <h1 className="text-2xl font-semibold">Устройства</h1>
        <button onClick={onClickAddDevice} className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer ">
          + Добавить устройство
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {devices.length === 0 ? (
        <p>Нет доступных устройств.</p>
      ) : (
        <ul className="space-y-2">
          {devices.map((device) => (
            <li key={device.id} className="p-4 bg-white shadow-xl rounded-2xl inset-ring-2 inset-ring-blue-500/50">
              <Device
                deviceId={device.id}
                deviceLast_connected={device.last_connected}
                deviceLast_online={device.last_online}
                deviceToken={device.device_token}
                deviceTokenId={device.device_token_id}
                telemetry={device.telemetry}
                deviceStatus={device.online}
                fetchDevices={fetchDevices}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
