const authController = require("../server/controllers/authController");
const authService = require("../server/services/authService");

// 1. Simulamos el servicio completo (El Chef)
jest.mock("../server/services/authService");

// 2. Función auxiliar para simular el objeto 'res' (La Respuesta)
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res); // Permite encadenar res.status().json()
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

describe("Pruebas unitarias para authController", () => {
  let req;
  let res;

  beforeAll(() => {
    // Silenciamos los console.error para no ensuciar la consola de tests
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    // Restauramos el console.error original
    console.error.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {}, cookies: {} }; // Reiniciamos req antes de cada test
    res = mockResponse(); // Reiniciamos res antes de cada test
  });

  // --- PRUEBAS: registrarUsuario ---
  describe("registrarUsuario", () => {
    test("Debería registrar usuario y devolver status 201", async () => {
      req.body = {
        nombre: "Juan",
        correo: "juan@test.com",
        password: "123",
        rol: "Estudiante",
      };
      authService.registrarUsuario.mockResolvedValue({
        rol: "Estudiante",
        correo: "juan@alu.uct.cl",
      });

      await authController.registrarUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          msg: expect.stringContaining("creado con éxito"),
        }),
      );
    });

    test("Debería devolver 400 si el correo ya está registrado", async () => {
      authService.registrarUsuario.mockRejectedValue(
        new Error("El correo ya está registrado"),
      );

      await authController.registrarUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: "El correo ya está registrado",
      });
    });

    test("Debería devolver 500 ante un error inesperado", async () => {
      authService.registrarUsuario.mockRejectedValue(
        new Error("Error fatal de base de datos"),
      );

      await authController.registrarUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error al registrar usuario");
    });
  });

  // --- PRUEBAS: login ---
  describe("login", () => {
    test("Debería iniciar sesión, guardar cookie y devolver status 200", async () => {
      req.body = { correo: "juan@alu.uct.cl", password: "123" };
      const mockDatos = {
        accessToken: "access123",
        refreshToken: "refresh123",
        user: { id: "1" },
      };
      authService.login.mockResolvedValue(mockDatos);

      await authController.login(req, res);

      // Verificamos que se guardó la cookie
      expect(res.cookie).toHaveBeenCalledWith(
        "jwt_refresh",
        "refresh123",
        expect.any(Object),
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        accessToken: "access123",
        user: { id: "1" },
      });
    });

    test("Debería devolver 400 ante credenciales inválidas", async () => {
      // Nota: Ajustamos el mock para que coincida con el texto exacto que busca tu if()
      authService.login.mockRejectedValue(
        new Error("Credenciales inválidas. Intente de nuevo."),
      );

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          msg: expect.stringContaining("Credenciales inválidas"),
        }),
      );
    });

    test("Debería devolver 500 ante un error inesperado", async () => {
      authService.login.mockRejectedValue(new Error("Caída de servidor"));

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        "Error en el servidor durante el login",
      );
    });
  });

  // --- PRUEBAS: refreshToken ---
  describe("refreshToken", () => {
    test("Debería devolver 401 si no hay cookie presente", async () => {
      req.cookies = {}; // Sin cookie

      await authController.refreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false }),
      );
    });

    test("Debería renovar el token y devolver 200 si la cookie es válida", async () => {
      req.cookies = { jwt_refresh: "token-valido" };
      authService.renovarToken.mockResolvedValue({
        newAccessToken: "nuevo-access-123",
      });

      await authController.refreshToken(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        accessToken: "nuevo-access-123",
      });
    });

    test("Debería limpiar la cookie y devolver 403 si el token es inválido", async () => {
      req.cookies = { jwt_refresh: "token-falso" };
      authService.renovarToken.mockRejectedValue(new Error("Token corrupto"));

      await authController.refreshToken(req, res);

      expect(res.clearCookie).toHaveBeenCalledWith("jwt_refresh");
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false }),
      );
    });
  });

  // --- PRUEBAS: obtenerUsuarios ---
  describe("obtenerUsuarios", () => {
    test("Debería devolver la lista de usuarios", async () => {
      authService.obtenerUsuarios.mockResolvedValue([{ nombre: "Juan" }]);

      await authController.obtenerUsuarios(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        usuarios: [{ nombre: "Juan" }],
      });
    });

    test("Debería devolver 500 si ocurre un error", async () => {
      authService.obtenerUsuarios.mockRejectedValue(new Error("Error DB"));

      await authController.obtenerUsuarios(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error al obtener los usuarios");
    });
  });
});
