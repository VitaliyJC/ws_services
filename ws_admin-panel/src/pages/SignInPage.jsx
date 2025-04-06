import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/users/login", { email, password });

      const data = res.data;
      console.log("data ", data.token);

      window.localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <div className="flex gap-5">
          <h2 className="text-2xl font-semibold mb-4 underline hover:underline">Войти</h2>
          <Link className="text-2xl font-semibold mb-4 hover:underline" to="/sign_up">
            Зарегистрироваться
          </Link>
        </div>

        {error && <div className="text-red-500 mb-2">{error}</div>}

        <input type="email" placeholder="Email" className="w-full mb-3 px-3 py-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} />

        <input type="password" placeholder="Пароль" className="w-full mb-4 px-3 py-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition cursor-pointer">
          Войти
        </button>
      </form>
    </div>
  );
}
