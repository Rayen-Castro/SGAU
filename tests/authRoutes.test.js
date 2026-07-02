// Simulamos Express y su Router ANTES de requerir las rutas
const mockRouter = {
  post: jest.fn(),
  get: jest.fn(),
};
jest.mock("express", () => ({
  Router: () => mockRouter,
}));

// Simulamos los controladores para que no interfieran
jest.mock("../server/controllers/authController", () => ({
  registrarUsuario: jest.fn(),
  login: jest.fn(),
  refreshToken: jest.fn(),
  obtenerUsuarios: jest.fn(),
}));

describe("Pruebas de rutas: authRoutes", () => {
  test("Debería registrar correctamente las rutas de autenticación", () => {
    // Al requerir el archivo, se ejecutarán los router.post y router.get simulados
    require("../server/routes/authRoutes");

    // Verificamos que se hayan registrado las rutas principales
    expect(mockRouter.post).toHaveBeenCalledWith(
      "/registrar",
      expect.any(Function),
    );
    expect(mockRouter.post).toHaveBeenCalledWith(
      "/login",
      expect.any(Function),
    );
    expect(mockRouter.post).toHaveBeenCalledWith(
      "/refresh",
      expect.any(Function),
    );
    expect(mockRouter.get).toHaveBeenCalledWith(
      "/usuarios",
      expect.any(Function),
    );
  });
});
