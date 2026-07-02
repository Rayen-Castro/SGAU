const gradeController = require("../server/controllers/gradeController");
const gradeService = require("../server/services/gradeService");

// 1. Simulamos el servicio de calificaciones
jest.mock("../server/services/gradeService");

// 2. Función auxiliar para simular la respuesta HTTP
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("Pruebas unitarias para gradeController", () => {
  let req;
  let res;

  beforeAll(() => {
    // Silenciamos los errores en consola durante los tests
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {}, params: {} };
    res = mockResponse();
  });

  // --- PRUEBAS: guardarCalificacion ---
  describe("guardarCalificacion", () => {
    test("Debería devolver 200 si la nota fue ACTUALIZADA", async () => {
      req.body = { estudiante: "123", asignatura: "456", valor: 6.5 };

      // Simulamos que el servicio detectó una nota existente y la actualizó
      gradeService.guardarCalificacion.mockResolvedValue({
        accion: "actualizada",
        nota: { valor: 6.5 },
      });

      await gradeController.guardarCalificacion(req, res);

      // En Express, res.json() por defecto envía un status 200, por lo que verificamos que NO se llamó a status(201)
      expect(res.status).not.toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          msg: "Nota actualizada y auditada con éxito.",
        }),
      );
    });

    test("Debería devolver 201 si la nota fue CREADA por primera vez", async () => {
      req.body = { estudiante: "123", asignatura: "456", valor: 7.0 };

      // Simulamos que el servicio creó una nota nueva
      gradeService.guardarCalificacion.mockResolvedValue({
        accion: "creada",
        nota: { valor: 7.0 },
      });

      await gradeController.guardarCalificacion(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          msg: "Nota registrada con éxito.",
        }),
      );
    });

    test("Debería devolver 400 si la nota no está entre 1.0 y 7.0", async () => {
      // Simulamos que el servicio arrojó el error exacto que espera tu 'if'
      gradeService.guardarCalificacion.mockRejectedValue(
        new Error("La nota debe estar entre 1.0 y 7.0"),
      );

      await gradeController.guardarCalificacion(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        msg: "La nota debe estar entre 1.0 y 7.0",
      });
    });

    test("Debería devolver 500 ante un error inesperado del servidor", async () => {
      gradeService.guardarCalificacion.mockRejectedValue(
        new Error("Caída de BD"),
      );

      await gradeController.guardarCalificacion(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        "Error al procesar la calificación",
      );
    });
  });

  // --- PRUEBAS: obtenerNotasPorAsignatura ---
  describe("obtenerNotasPorAsignatura", () => {
    test("Debería obtener las notas de la asignatura y devolver 200", async () => {
      req.params.asignaturaId = "asignatura123";
      gradeService.obtenerNotasPorAsignatura.mockResolvedValue([
        { valor: 6.0 },
      ]);

      await gradeController.obtenerNotasPorAsignatura(req, res);

      expect(gradeService.obtenerNotasPorAsignatura).toHaveBeenCalledWith(
        "asignatura123",
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        notas: [{ valor: 6.0 }],
      });
    });

    test("Debería devolver 500 si falla la obtención de notas", async () => {
      req.params.asignaturaId = "asignatura123";
      gradeService.obtenerNotasPorAsignatura.mockRejectedValue(
        new Error("Timeout"),
      );

      await gradeController.obtenerNotasPorAsignatura(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error al obtener las notas");
    });
  });
});
