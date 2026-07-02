const mockRouter = {
  post: jest.fn(),
  get: jest.fn(),
};
jest.mock("express", () => ({
  Router: () => mockRouter,
}));

jest.mock("../server/controllers/gradeController", () => ({
  guardarCalificacion: jest.fn(),
  obtenerNotasPorAsignatura: jest.fn(),
}));

describe("Pruebas de rutas: gradeRoutes", () => {
  test("Debería registrar correctamente las rutas de calificaciones", () => {
    require("../server/routes/gradeRoutes");

    expect(mockRouter.post).toHaveBeenCalledWith("/", expect.any(Function));
    expect(mockRouter.get).toHaveBeenCalledWith(
      "/asignatura/:asignaturaId",
      expect.any(Function),
    );
  });
});
