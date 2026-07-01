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
    // 1. El servicio ahora nos devuelve DOS tokens (Access y Refresh)
    const { accessToken, refreshToken, user } = await authService.login(
      correo,
      password,
    );

    // 2. Guardamos el Refresh Token en una Cookie HttpOnly (Seguridad máxima)
    // El frontend NO puede leer esto con JavaScript, previniendo robos de sesión.
    res.cookie("jwt_refresh", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días de validez
    });

    // 3. Devolvemos el Access Token de corta duración para uso inmediato
    res.json({
      success: true,
      accessToken,
      user,
    });
  } catch (error) {
    console.error(error);
    if (error.message.includes("Credenciales inválidas")) {
      return res.status(400).json({ msg: error.message });
    }
    res.status(500).send("Error en el servidor durante el login");
  }
};

// NUEVA FUNCIÓN: Para renovar la sesión silenciosamente (Refresh Token)
exports.refreshToken = async (req, res) => {
  // Leemos la cookie que guardamos en el login
  const refreshToken = req.cookies?.jwt_refresh;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      msg: "Sesión expirada. Inicie sesión nuevamente.",
    });
  }

  try {
    // Delegamos la verificación y creación del nuevo token al servicio
    const { newAccessToken } = await authService.renovarToken(refreshToken);

    res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Error al renovar token:", error);
    // Si el refresh token es inválido, limpiamos la cookie
    res.clearCookie("jwt_refresh");
    return res
      .status(403)
      .json({ success: false, msg: "Refresh token inválido." });
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
