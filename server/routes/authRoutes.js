// server/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/registrar", authController.registrarUsuario);

router.post("/login", authController.login);

router.post("/refresh", authController.refreshToken);

router.get("/usuarios", authController.obtenerUsuarios);

module.exports = router;
