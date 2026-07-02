// tests/authService.test.js
const authService = require("../server/services/authService");
const User = require("../server/models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 1. Simulamos el modelo User de Mongoose
jest.mock("../server/models/user", () => {
  const MockUser = function (datos) {
    Object.assign(this, datos);
    this.save = jest.fn().mockResolvedValue(true);
  };
  MockUser.findOne = jest.fn();
  return MockUser;
});

// 2. Simulamos bcrypt y jwt
jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
  hash: jest.fn().mockResolvedValue("password-encriptado-fake"),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("token-falso-123"),
}));

describe("Pruebas unitarias para authService - iniciarSesion", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Debería lanzar un error si el usuario no existe", async () => {
    // Simulamos que el usuario no fue encontrado en la BD
    User.findOne.mockResolvedValue(null);

    await expect(
      authService.login("correo@duoc.cl", "password123"),
    ).rejects.toThrow("Usuario no encontrado");
  });

  test("Debería iniciar sesión con éxito si las credenciales son válidas", async () => {
    const usuarioFalso = {
      id: "user123",
      correo: "correo@duoc.cl",
      password: "password-encriptado-real-en-bd",
    };

    // Simulamos que encuentra al usuario
    User.findOne.mockResolvedValue(usuarioFalso);
    // Simulamos que bcrypt dice "sí, la contraseña coincide"
    bcrypt.compare.mockResolvedValue(true);

    const resultado = await authService.login("correo@duoc.cl", "password123");

    // Verificaciones finales
    expect(resultado).toHaveProperty("accessToken");
    expect(resultado.accessToken).toBe("token-falso-123");
    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).toHaveBeenCalledTimes(1);
  });
});
