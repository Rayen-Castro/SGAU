const asignaturaService = require("../server/services/asignaturaService");
const Asignatura = require("../server/models/asignatura");

// Simulamos el modelo Asignatura de Mongoose
jest.mock("../server/models/asignatura", () => {
  // 1. Simulamos el encadenamiento de funciones (find -> populate -> lean)
  const mockQuery = {
    populate: jest.fn().mockReturnThis(), // Permite hacer .populate().populate()
    lean: jest.fn().mockResolvedValue([{ nombreAsignatura: "Simulación" }]), // Retorna un array falso al usar lean()
  };

  // Hacemos que la cadena se pueda resolver con un 'await' aunque no termine en lean()
  mockQuery.then = function (resolve) {
    resolve([{ nombreAsignatura: "Simulación" }]);
  };

  // 2. Simulamos la creación de una nueva Asignatura (new Asignatura)
  const MockModel = function (datos) {
    Object.assign(this, datos);
    this.save = jest.fn().mockResolvedValue(this);
  };

  MockModel.find = jest.fn().mockReturnValue(mockQuery);

  return MockModel;
});

describe("Pruebas unitarias para asignaturaService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- PRUEBAS: crearAsignatura ---
  describe("crearAsignatura", () => {
    test("Debería lanzar error si las ponderaciones NO suman 100", async () => {
      const datosIncompletos = {
        evaluaciones: [
          { nombre: "Prueba 1", ponderacion: 50 },
          { nombre: "Prueba 2", ponderacion: 40 }, // Suma 90%
        ],
      };

      await expect(
        asignaturaService.crearAsignatura(datosIncompletos),
      ).rejects.toThrow(
        "La suma de las ponderaciones es 90%. Debe ser exactamente 100%.",
      );
    });

    test("Debería crear y guardar la asignatura si las ponderaciones suman 100", async () => {
      const datosCorrectos = {
        nombreAsignatura: "Arquitectura de Software",
        evaluaciones: [
          { nombre: "Prueba 1", ponderacion: 50 },
          { nombre: "Prueba 2", ponderacion: 50 }, // Suma 100%
        ],
      };

      const resultado = await asignaturaService.crearAsignatura(datosCorrectos);

      expect(resultado.nombreAsignatura).toBe("Arquitectura de Software");
      expect(resultado.save).toHaveBeenCalledTimes(1); // Verificamos que llamó a Mongoose
    });
  });

  // --- PRUEBAS: obtenerTodas ---
  describe("obtenerTodas", () => {
    test("Debería obtener todas las asignaturas usando populate", async () => {
      const resultado = await asignaturaService.obtenerTodas();

      expect(Asignatura.find).toHaveBeenCalledTimes(1);
      expect(resultado).toHaveLength(1);
      expect(resultado[0].nombreAsignatura).toBe("Simulación");
    });
  });

  // --- PRUEBAS: obtenerPorDocente ---
  describe("obtenerPorDocente", () => {
    test("Debería buscar las asignaturas filtrando por el ID del docente", async () => {
      await asignaturaService.obtenerPorDocente("docente123");

      expect(Asignatura.find).toHaveBeenCalledWith({ docente: "docente123" });
    });
  });

  // --- PRUEBAS: obtenerPorEstudiante ---
  describe("obtenerPorEstudiante", () => {
    test("Debería buscar las asignaturas del estudiante usando lean", async () => {
      await asignaturaService.obtenerPorEstudiante("estudiante456");

      expect(Asignatura.find).toHaveBeenCalledWith({
        estudiantesInscritos: "estudiante456",
      });
    });
  });
});
