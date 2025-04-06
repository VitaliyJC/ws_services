import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Все поля обязательны" });
    }

    // Проверка по email
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Пользователь с таким email уже существует" });
    }

    // Хеширование пароля
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Создание пользователя (модель сама хеширует пароль)
    const user = await UserModel.create({
      username,
      email,
      hashed_password: hashedPassword,
    });

    // Убираем пароль
    res.status(201).json({
      message: "Пользователь успешно зарегистрирован",
      user,
    });
  } catch (err) {
    console.error("❌ Ошибка регистрации:", err);
    res.status(500).json({ message: "Не удалось зарегистрироваться" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email и пароль обязательны" });
    }

    const user = await UserModel.findByEmailWithPassword(email);
    if (!user) {
      return res.status(401).json({ message: "Неверные email или пароль" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashed_password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Неверные email или пароль" });
    }

    const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: "7d" });

    // Убираем пароль из объекта перед отправкой
    delete user.hashed_password;

    res.json({
      message: "Успешный вход",
      user,
      token,
    });
  } catch (err) {
    console.error("❌ Ошибка входа:", err);
    res.status(500).json({ message: "Не удалось войти" });
  }
};

export const logout = async (req, res) => {
  try {
    // Если токен хранился на клиенте — просто сообщаем о выходе
    res.json({ message: "Вы вышли из системы" });
  } catch (err) {
    console.error("❌ Ошибка выхода:", err);
    res.status(500).json({ message: "Не удалось выйти" });
  }
};
