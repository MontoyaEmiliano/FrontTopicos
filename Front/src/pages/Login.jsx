// src/pages/Login.jsx
import React, { useState } from "react";
import { Package, LogIn, AlertCircle } from "lucide-react";
import * as authApi from "../services/auth";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await authApi.login(email, password);

      const token = data.access_token;
      const user = data.user;

      if (!token) {
        throw new Error("Respuesta inválida del servidor");
      }

      localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      onLogin(token, user);
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Package className="w-12 h-12 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Traceability</h1>
        </div>

        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Iniciar Sesión
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center transition-colors"
          >
            <LogIn className="w-5 h-5 mr-2" />
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
          <p className="font-semibold mb-2">💡 Usuarios de prueba (seeders):</p>
          <p className="mb-1"><strong>Admin:</strong> admin@test.com / admin123</p>
          <p className="mb-1"><strong>Supervisor:</strong> sup@test.com / sup123</p>
          <p><strong>Operador:</strong> op@test.com / op123</p>
        </div>
      </div>
    </div>
  );
}