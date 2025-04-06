// import { useEffect, useState } from "react";
import api from "../utils/axios";

export default function Device({ deviceId, deviceStatus, deviceLast_connected, deviceLast_online, deviceToken, deviceTokenId, telemetry, fetchDevices }) {
  // const [lastTelemetry, setLastTelemetry] = useState([]);

  const generateDeviceToken = async () => {
    await api.put(`/device-tokens`, { deviceId });
    await fetchDevices();
  };

  const deleteDeviceToken = async () => {
    if (window.confirm("Вы уверенны, что хотите удалить токен доступа устройства?")) {
      await api.delete(`/device-tokens/${deviceTokenId}`);
      await fetchDevices();
    }
  };

  const deleteDevice = async () => {
    if (window.confirm("Вы уверенны, что хотите удалить устройство?")) {
      await api.delete(`/devices/${deviceId}`);
      await fetchDevices();
    }
  };

  const displayTime = deviceLast_online ? new Date(deviceLast_online).toLocaleString() : deviceLast_connected ? new Date(deviceLast_connected).toLocaleString() : "-";

  return (
    <ul className="space-y-2">
      <li>
        <p>
          <strong>ID:</strong> {deviceId}
        </p>
        <p>
          <strong>Статус:</strong> {deviceStatus ? "Подключено" : "Отключено"}
        </p>
        <p>
          <strong>Последнее подключение:</strong> {displayTime}
        </p>
        <p>
          <strong>Токен:</strong> {deviceToken || "Не сгенерирован"}
        </p>

        {deviceStatus ? (
          <div className="mt-2 p-2 border rounded bg-gray-50">
            <p>
              <strong>🔋 Напряжение:</strong> {telemetry.voltage} В
            </p>
            <p>
              <strong>🌡 Температура:</strong> {telemetry.temperature} °C
            </p>
            <p>
              <strong>🕒 Время:</strong> {new Date(telemetry.timestamp).toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">Нет телеметрии</p>
        )}
      </li>

      <li className="flex justify-between">
        <div className="space-x-2">
          <button onClick={generateDeviceToken} className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer ">
            {deviceToken ? "Обновить токен" : "Создать токен"}
          </button>
          {deviceToken && (
            <button onClick={deleteDeviceToken} className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer ">
              Удалить токен
            </button>
          )}
        </div>
        <button onClick={deleteDevice} className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer ">
          Удалить устройство
        </button>
      </li>
    </ul>
  );
}
