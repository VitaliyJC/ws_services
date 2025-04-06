-- Пользователи
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL
);

-- Устройства
CREATE TABLE IF NOT EXISTS devices (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  device_token_id INTEGER UNIQUE,
  status VARCHAR(50),
  last_connected TIMESTAMP
);

-- Токены устройств
CREATE TABLE IF NOT EXISTS device_tokens (
  id SERIAL PRIMARY KEY,
  token VARCHAR(255) UNIQUE NOT NULL,
  device_id INTEGER UNIQUE REFERENCES devices(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Телеметрия
CREATE TABLE IF NOT EXISTS telemetry (
  id SERIAL PRIMARY KEY,
  device_id INTEGER REFERENCES devices(id) ON DELETE CASCADE,
  voltage NUMERIC,
  temperature NUMERIC,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
