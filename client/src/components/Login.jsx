// src/components/Login.jsx
import React from "react";

export function Login({
  correo,
  setCorreo,
  password,
  setPassword,
  error,
  manejarLogin,
}) {
  const inputStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e0",
    boxSizing: "border-box",
    fontSize: "13px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    color: "white",
    backgroundColor: "#004a99",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  };

  return (
    <div
      style={{
        background: "white",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        maxWidth: "400px",
        margin: "auto",
        marginTop: "10vh",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#333", marginTop: 0 }}>
        Iniciar Sesión
      </h2>

      {error && (
        <p
          style={{
            color: "white",
            backgroundColor: "#e53e3e",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "14px",
            marginTop: 0,
            marginBottom: "15px",
          }}
        >
          {error}
        </p>
      )}

      <form onSubmit={manejarLogin}>
        <input
          type="email"
          placeholder="Correo"
          required
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Contraseña"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          Ingresar al Sistema
        </button>
      </form>
    </div>
  );
}
