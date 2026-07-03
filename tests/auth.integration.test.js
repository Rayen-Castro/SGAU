// server/tests/auth.integration.test.js
const request = require("supertest");
const express = require("express");

const authRoutes = require("../server/routes/authRoutes");
const authService = require("../server/services/authService");

// 1. Simulamos la capa de base de datos/servicio
jest.mock("../server/services/authService");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Pruebas de Integración: Rutas de Autenticación", () => {
  it("POST /api/auth/login - Debería rechazar un login inválido (Integración Ruta-Controlador)", async () => {
    authService.login.mockRejectedValue(
      new Error("Credenciales inválidas (usuario no existe)"),
    );

    // 2. PETICIÓN HTTP simulada a la ruta de login
    const response = await request(app).post("/api/auth/login").send({});

    // 3. Verificamos que el controlador atrapó el error del servicio
    expect(response.status).toBe(400);
    expect(response.body.msg).toContain("Credenciales inválidas");
  });
});
