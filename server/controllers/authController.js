// server/controllers/authController.js
const authService = require("../services/authService");

exports.registrarUsuario = async (req, res) => {
  try {
    // Delegamos toda la limpieza, validación y guardado al servicio
    const { rol, correo } = await authService.registrarUsuario(req.body);

    res.status(201).json({
      success: true,
      msg: `Usuario [${rol}] creado con éxito. Correo asignado: ${correo}`,
    });
  } catch (error) {
    console.error(error);
    // Manejo de errores controlados por nuestro servicio
    if (error.message.includes("ya está registrado")) {
      return res.status(400).json({ msg: error.message });
    }
    res.status(500).send("Error al registrar usuario");
  }
};

exports.login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    // El servicio nos devuelve directamente el token y el usuario limpio
    const { token, user } = await authService.login(correo, password);

    res.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    // Manejo de errores controlados por nuestro servicio
    if (error.message.includes("Credenciales inválidas")) {
      return res.status(400).json({ msg: error.message });
    }
    res.status(500).send("Error en el servidor durante el login");
  }
};

exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await authService.obtenerUsuarios();
    res.json({ success: true, usuarios });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los usuarios");
  }
};
