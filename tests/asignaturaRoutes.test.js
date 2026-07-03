const mockRouter = {
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};
jest.mock("express", () => ({
  Router: () => mockRouter,
}));

jest.mock("../server/controllers/asignaturaController", () => ({
  crearAsignatura: jest.fn(),
  obtenerAsignaturas: jest.fn(),
  obtenerAsignaturasDocente: jest.fn(),
  obtenerAsignaturasEstudiante: jest.fn(),
}));

describe("Pruebas de rutas: asignaturaRoutes", () => {
  test("Debería registrar correctamente las rutas de asignaturas", () => {
    require("../server/routes/asignaturaRoutes");

    expect(mockRouter.post).toHaveBeenCalledWith(
      "/crear",
      expect.any(Function),
    );

    expect(mockRouter.get).toHaveBeenCalledWith("/", expect.any(Function));
    expect(mockRouter.get).toHaveBeenCalledWith(
      "/docente/:docenteId",
      expect.any(Function),
    );
    expect(mockRouter.get).toHaveBeenCalledWith(
      "/estudiante/:estudianteId",
      expect.any(Function),
    );
  });
});
