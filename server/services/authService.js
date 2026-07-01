// server/services/authService.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 1. REGISTRAR USUARIO (Monei Ava Pyahu)
exports.registrarUsuario = async (datos) => {
  let { nombre, correo, password, rol, carrera } = datos;

  // Tekorã mbykypyre: Mboheko ha mbohasa correo UCT
  let usuarioLimpio = correo.trim().toLowerCase();
  usuarioLimpio = usuarioLimpio.split("@")[0];
  usuarioLimpio = usuarioLimpio.replace(".alu", "").replace("alu", "");

  if (usuarioLimpio.endsWith(".")) {
    usuarioLimpio = usuarioLimpio.slice(0, -1);
  }

  if (rol === "Estudiante") {
    correo = `${usuarioLimpio}@alu.uct.cl`;
  } else if (rol === "Docente") {
    correo = `${usuarioLimpio}@uct.cl`;
  }

  // Tekorã mbykypyre: Hecha oĩma piko correo tembiporúpe
  let usuarioExiste = await User.findOne({ correo });
  if (usuarioExiste) {
    throw new Error(`UCT correo [${correo}] oĩma tembiporúpe. Eipuru ambue.`);
  }

  // Tekorã mbykypyre: Ñemi ñe'ẽñemi (Hashing)
  const salt = await bcrypt.genSalt(10);
  const passwordHasheada = await bcrypt.hash(password, salt);

  // Tembiporu Tenda Renda rembiapo
  const nuevoUsuario = new User({
    nombre,
    correo,
    password: passwordHasheada,
    rol,
    carrera,
  });
  await nuevoUsuario.save();

  // Ñambohasa marandu oiko porãva
  return { rol, correo };
};

// 2. INICIO DE SESIÓN (Ñehekýi Login)
exports.login = async (correo, password) => {
  // Hecha oĩpa ava mbo'eha renda rendápe
  const usuario = await User.findOne({ correo });
  if (!usuario) {
    throw new Error("Monei ava ndoikói (Ava ndoikéi tembiporúpe)");
  }

  // Mbojoja ñe'ẽñemi (Password comparison)
  const match = await bcrypt.compare(password, usuario.password);
  if (!match) {
    throw new Error("Ñe'ẽñemi ndoikói (Eha'arã jey)");
  }

  // Tekorã mbykypyre: Mboheko payload access token ha refresh token rehegua
  const payloadAccess = { id: usuario._id, rol: usuario.rol };
  const payloadRefresh = { id: usuario._id };

  // Access Token mbykyva (15 min) ha Refresh Token pukúva (7 ára)
  const accessToken = jwt.sign(
    payloadAccess,
    process.env.JWT_SECRET || "firma_secreta_uct",
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    payloadRefresh,
    process.env.JWT_REFRESH_SECRET || "firma_refresh_secreta_uct",
    { expiresIn: "7d" },
  );

  return {
    accessToken,
    refreshToken,
    user: {
      _id: usuario._id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
    },
  };
};

// 3. MBOHAPYHA TOKEN PYAHU (Renovar Access Token)
exports.renovarToken = async (refreshToken) => {
  try {
    // Hecha oiko porãpa refresh token rembiapo
    const verificado = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || "firma_refresh_secreta_uct",
    );

    // Eheka ava tenda rendápe
    const usuario = await User.findById(verificado.id);
    if (!usuario) {
      throw new Error("Ava ndoikói tembiporúpe");
    }

    // Me'ẽ access token pyahu mba'e porãve mbykyva (15 min)
    const newAccessToken = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET || "firma_secreta_uct",
      { expiresIn: "15m" },
    );

    return { newAccessToken };
  } catch (error) {
    throw new Error("Refresh token ndoikói (Eike jey mbo'eharandápe)");
  }
};

// 4. GUEREKO AVAKUÉRA (Obtener Usuarios)
exports.obtenerUsuarios = async () => {
  return await User.find().select("-password");
};
