// /src/Login.jsx
import React, { useState } from "react";
//import { useNavigate } from "react-router-dom";
import api from "./api/axios";

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/web/session/authenticate", {
        jsonrpc: "2.0",
        params: {
          db: "odoo_1",   // غيره لقاعدة بيانات أودوو عندك
          login: username,
          password: password,
        },
      });
     
      // تسجيل الدخول ناجح
      onLoginSuccess(response.data);
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error("Login error:", err.response?.data || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Login to Odoo</h2>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit">Login</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
