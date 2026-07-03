const asignaturaController = require("../server/controllers/asignaturaController");
const asignaturaService = require("../server/services/asignaturaService");

// 1. Simulamos el servicio completo
jest.mock("../server/services/asignaturaService");

// 2. Función auxiliar para simular el objeto 'res'
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("Pruebas unitarias para asignaturaController", () => {
  let req;
  let res;

  beforeAll(() => {
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

  // --- PRUEBAS: crearAsignatura ---
  describe("crearAsignatura", () => {
    test("Debería crear una asignatura exitosamente y responder 201", async () => {
      req.body = {
        nombreAsignatura: "Cálculo 1",
        evaluaciones: [{ nombre: "Solemne 1" }],
      };

      asignaturaService.crearAsignatura.mockResolvedValue({
        nombreAsignatura: "Cálculo 1",
        evaluaciones: [{ nombre: "Solemne 1" }],
      });

      await asignaturaController.crearAsignatura(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true }),
      );
    });

    test("Debería devolver 400 si MongoDB arroja código de duplicado (11000)", async () => {
      const errorDuplicado = new Error("Llave duplicada");
      errorDuplicado.code = 11000;
      asignaturaService.crearAsignatura.mockRejectedValue(errorDuplicado);

      await asignaturaController.crearAsignatura(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        msg: "El nombre o código de la asignatura ya existe.",
      });
    });

    test("Debería devolver 400 si el error menciona las ponderaciones", async () => {
      asignaturaService.crearAsignatura.mockRejectedValue(
        new Error("Las ponderaciones deben sumar 100%"),
      );

      await asignaturaController.crearAsignatura(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        msg: "Las ponderaciones deben sumar 100%",
      });
    });

    test("Debería devolver 500 ante cualquier otro error inesperado", async () => {
      asignaturaService.crearAsignatura.mockRejectedValue(
        new Error("Error de conexión de red"),
      );

      await asignaturaController.crearAsignatura(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error al crear la asignatura");
    });
  });

  // --- PRUEBAS: obtenerAsignaturas ---
  describe("obtenerAsignaturas", () => {
    test("Debería obtener todas las asignaturas y responder 200", async () => {
      asignaturaService.obtenerTodas.mockResolvedValue([
        { nombreAsignatura: "Física" },
      ]);

      await asignaturaController.obtenerAsignaturas(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        asignaturas: [{ nombreAsignatura: "Física" }],
      });
    });

    test("Debería devolver 500 si falla la obtención", async () => {
      asignaturaService.obtenerTodas.mockRejectedValue(
        new Error("Error interno"),
      );

      await asignaturaController.obtenerAsignaturas(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error al obtener las asignaturas");
    });
  });

  // --- PRUEBAS: obtenerAsignaturasDocente ---
  describe("obtenerAsignaturasDocente", () => {
    test("Debería obtener las asignaturas del docente según su ID", async () => {
      req.params.docenteId = "docente789";
      asignaturaService.obtenerPorDocente.mockResolvedValue([
        { nombreAsignatura: "Química" },
      ]);

      await asignaturaController.obtenerAsignaturasDocente(req, res);

      expect(asignaturaService.obtenerPorDocente).toHaveBeenCalledWith(
        "docente789",
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        asignaturas: [{ nombreAsignatura: "Química" }],
      });
    });

    test("Debería responder 500 si falla la búsqueda por docente", async () => {
      req.params.docenteId = "docente789";
      asignaturaService.obtenerPorDocente.mockRejectedValue(
        new Error("Error DB"),
      );

      await asignaturaController.obtenerAsignaturasDocente(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        "Error al obtener las asignaturas del docente",
      );
    });
  });

  // --- PRUEBAS: obtenerAsignaturasEstudiante ---
  describe("obtenerAsignaturasEstudiante", () => {
    test("Debería obtener las asignaturas donde el estudiante está inscrito", async () => {
      req.params.estudianteId = "estudiante456";
      asignaturaService.obtenerPorEstudiante.mockResolvedValue([
        { nombreAsignatura: "Álgebra" },
      ]);

      await asignaturaController.obtenerAsignaturasEstudiante(req, res);

      expect(asignaturaService.obtenerPorEstudiante).toHaveBeenCalledWith(
        "estudiante456",
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        asignaturas: [{ nombreAsignatura: "Álgebra" }],
      });
    });

    test("Debería responder 500 si falla la búsqueda por estudiante", async () => {
      req.params.estudianteId = "estudiante456";
      asignaturaService.obtenerPorEstudiante.mockRejectedValue(
        new Error("Error DB"),
      );

      await asignaturaController.obtenerAsignaturasEstudiante(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        "Error al obtener las asignaturas del estudiante",
      );
    });
  });
});
