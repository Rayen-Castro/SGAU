// server/tests/auth.integration.test.js
const request = require("supertest");
const express = require("express");
const authRoutes = require("../server/routes/authRoutes");

// Importamos el servicio para poder simularlo
const authService = require("../server/services/authService");

// 1. Simulamos la capa de base de datos/servicio
jest.mock("../server/services/authService");

// Levantamos una versión de prueba de tu aplicación Express
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Pruebas de Integración: Rutas de Autenticación", () => {
  it("POST /api/auth/login - Debería rechazar un login inválido (Integración Ruta-Controlador)", async () => {
    // Le decimos a nuestro servicio simulado que lance un error
    // tal como lo haría si no encuentra el usuario en MongoDB
    authService.login.mockRejectedValue(
      new Error("Credenciales inválidas (usuario no existe)"),
    );

    // 2. Hacemos la petición HTTP REAL a nuestra app
    const response = await request(app).post("/api/auth/login").send({}); // Body vacío

    // 3. Verificamos que el controlador atrapó el error del servicio
    // y lo transformó correctamente en un código HTTP 400
    expect(response.status).toBe(400);
    expect(response.body.msg).toContain("Credenciales inválidas");
  });
});
