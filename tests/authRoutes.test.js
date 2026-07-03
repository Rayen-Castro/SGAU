// Simulamos Express y su Router ANTES de requerir las rutas
const mockRouter = {
  post: jest.fn(),
  get: jest.fn(),
};
jest.mock("express", () => ({
  Router: () => mockRouter,
}));

jest.mock("../server/controllers/authController", () => ({
  registrarUsuario: jest.fn(),
  login: jest.fn(),
  refreshToken: jest.fn(),
  obtenerUsuarios: jest.fn(),
}));

describe("Pruebas de rutas: authRoutes", () => {
  test("Debería registrar correctamente las rutas de autenticación", () => {
    require("../server/routes/authRoutes");

    // registrarUsuario, login, refreshToken y obtenerUsuarios
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
