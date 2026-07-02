const authService = require("../server/services/authService");
const user = require("../server/models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 1. Simulamos el modelo User de Mongoose
jest.mock("../server/models/user", () => {
  const MockUser = function (datos) {
    Object.assign(this, datos);
    this.save = jest.fn().mockResolvedValue(true);
  };
  MockUser.findOne = jest.fn();
  MockUser.findById = jest.fn();

  // Simulamos find().select() encadenados
  MockUser.find = jest.fn().mockReturnValue({
    select: jest.fn().mockResolvedValue([{ nombre: "Usuario Prueba" }]),
  });

  return MockUser;
});

// 2. Simulamos bcrypt
jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
  hash: jest.fn().mockResolvedValue("password-encriptado"),
  genSalt: jest.fn().mockResolvedValue("salt"),
}));

// 3. Simulamos jsonwebtoken
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("token-falso-123"),
  verify: jest.fn().mockReturnValue({ id: "user123" }),
}));

describe("Pruebas unitarias para authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- PRUEBAS PARA LOGIN ---
  describe("Función login", () => {
    test("Debería lanzar error si el usuario no existe", async () => {
      user.findOne.mockResolvedValue(null);
      await expect(authService.login("correo@duoc.cl", "pass")).rejects.toThrow(
        "Usuario no encontrado",
      );
    });

    test("Debería iniciar sesión con éxito", async () => {
      user.findOne.mockResolvedValue({
        _id: "1",
        password: "hash",
        rol: "Estudiante",
      });
      bcrypt.compare.mockResolvedValue(true);

      const resultado = await authService.login("correo@duoc.cl", "pass");
      expect(resultado).toHaveProperty("accessToken");
    });
  });

  // --- PRUEBAS PARA REGISTRAR USUARIO ---
  describe("Función registrarUsuario", () => {
    test("Debería lanzar error si el correo ya existe", async () => {
      user.findOne.mockResolvedValue({ id: "1" }); // Simulamos que ya hay alguien

      const datos = {
        correo: "juan@alu.uct.cl",
        password: "123",
        rol: "Estudiante",
      };
      await expect(authService.registrarUsuario(datos)).rejects.toThrow(
        /ya está registrado/,
      );
    });

    test("Debería registrar un estudiante correctamente", async () => {
      user.findOne.mockResolvedValue(null); // No existe el usuario aún

      const datos = {
        nombre: "Juan",
        correo: " juan@gmail.com ",
        password: "123",
        rol: "Estudiante",
      };

      const resultado = await authService.registrarUsuario(datos);

      expect(resultado.correo).toBe("juan@alu.uct.cl");
      expect(resultado.rol).toBe("Estudiante");
    });
  });

  // --- PRUEBAS PARA RENOVAR TOKEN ---
  describe("Función renovarToken", () => {
    test("Debería lanzar error si el usuario no existe tras verificar el token", async () => {
      user.findById.mockResolvedValue(null);

      await expect(authService.renovarToken("token-viejo")).rejects.toThrow(
        "Error al actualizar el token. Vuelva a iniciar sesión.",
      );
    });

    test("Debería devolver un nuevo accessToken si todo es válido", async () => {
      user.findById.mockResolvedValue({ _id: "1", rol: "Docente" });

      const resultado = await authService.renovarToken("token-viejo");
      expect(resultado.newAccessToken).toBe("token-falso-123");
    });
  });

  // --- PRUEBAS PARA OBTENER USUARIOS ---
  describe("Función obtenerUsuarios", () => {
    test("Debería devolver la lista de usuarios sin la contraseña", async () => {
      const resultado = await authService.obtenerUsuarios();

      expect(resultado).toHaveLength(1);
      expect(resultado[0].nombre).toBe("Usuario Prueba");
      expect(user.find).toHaveBeenCalledTimes(1);
    });
  });
});
