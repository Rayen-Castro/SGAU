// server/tests/auth.integration.test.js
const request = require("supertest");
const express = require("express");
const authRoutes = require("../routes/authRoutes");

// 1. Levantamos una versión de prueba de tu aplicación Express
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Pruebas de Integración: Rutas de Autenticación", () => {
  it("POST /api/auth/login - Debería rechazar un login sin credenciales (Integración Ruta-Controlador)", async () => {
    // 2. Usamos supertest para hacer una petición HTTP REAL a nuestra app de prueba
    const response = await request(app).post("/api/auth/login").send({}); // Enviamos un body vacío

    // 3. Verificamos que la ruta y el controlador se comunicaron y rechazaron la petición
    expect(response.status).toBe(500); // O 400, dependiendo de cómo manejes el error de campos vacíos
  });
});
