import React, { useState } from "react";
import { login } from "../api";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login(email, password);
      const { token, user } = res.data; // token + { email, role, tenantId }
      setToken(token, user);
    } catch (err) {
      console.error("Login failed", err);
      setError("Invalid credentials or server error");
    }
  };

  const pageStyle = {
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    backgroundColor: "#f5f5f7",
    minHeight: "100vh",
    margin: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    padding: "30px 32px",
    width: "320px",
  };

  const titleStyle = {
    margin: 0,
    marginBottom: "6px",
    fontSize: "22px",
  };

  const subtitleStyle = {
    margin: 0,
    marginBottom: "18px",
    fontSize: "13px",
    color: "#6b7280",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 10px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontSize: "14px",
    cursor: "pointer",
    marginTop: "4px",
  };

  const errorStyle = {
    color: "#dc2626",
    fontSize: "13px",
    marginBottom: "10px",
  };

  return (
    <div style={pageStyle}>
      <form onSubmit={handleSubmit} style={cardStyle}>
        <h2 style={titleStyle}>Login</h2>
        <p style={subtitleStyle}>Sign in to your tenant dashboard</p>

        {error && <p style={errorStyle}>{error}</p>}

        <input
          style={inputStyle}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={inputStyle}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" style={buttonStyle}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
