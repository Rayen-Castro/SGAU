// tests/asignaturaService.test.js

// 1. ⚠️ PRIMERO DEFINIMOS EL MOCKQUERY (Arriba de todo para evitar el ReferenceError)
const mockQuery = {
  populate: jest.fn().mockReturnThis(), // Permite encadenar .populate().populate()
  lean: jest.fn().mockReturnThis(), // Permite encadenar .lean()
  then: jest.fn(), // Intercepta el 'await' de la consulta
};

// 2. LUEGO IMPORTAMOS LOS ARCHIVOS DEL PROYECTO
const asignaturaService = require("../server/services/asignaturaService");
const Asignatura = require("../server/models/asignatura");

// 3. CONFIGURAMOS EL MOCK DE JEST
jest.mock("../server/models/asignatura", () => {
  const MockModel = function (datos) {
    Object.assign(this, datos);
    this.save = jest.fn().mockResolvedValue(this);
  };

  // Mapeamos los métodos estáticos del modelo Mongoose a nuestros mocks
  MockModel.find = jest.fn().mockReturnValue(mockQuery);
  MockModel.findByIdAndUpdate = jest.fn().mockReturnValue(mockQuery);
  MockModel.findByIdAndDelete = jest.fn();

  return MockModel;
});

describe("Pruebas unitarias para asignaturaService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Configuración por defecto: Las consultas de lectura (find) devuelven un Array
    mockQuery.then.mockImplementation(function (resolve) {
      resolve([{ nombreAsignatura: "Simulación" }]);
    });
  });

  // =========================================================
  // --- PRUEBAS: crearAsignatura
  // =========================================================
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
      expect(resultado.save).toHaveBeenCalledTimes(1);
    });
  });

  // =========================================================
  // --- PRUEBAS: obtenerTodas
  // =========================================================
  describe("obtenerTodas", () => {
    test("Debería obtener todas las asignaturas usando populate", async () => {
      const resultado = await asignaturaService.obtenerTodas();

      expect(Asignatura.find).toHaveBeenCalledTimes(1);
      expect(resultado).toHaveLength(1);
      expect(resultado[0].nombreAsignatura).toBe("Simulación");
    });
  });

  // =========================================================
  // --- PRUEBAS: obtenerPorDocente
  // =========================================================
  describe("obtenerPorDocente", () => {
    test("Debería buscar las asignaturas filtrando por el ID del docente", async () => {
      await asignaturaService.obtenerPorDocente("docente123");

      expect(Asignatura.find).toHaveBeenCalledWith({ docente: "docente123" });
    });
  });

  // =========================================================
  // --- PRUEBAS: obtenerPorEstudiante
  // =========================================================
  describe("obtenerPorEstudiante", () => {
    test("Debería buscar las asignaturas del estudiante usando lean", async () => {
      await asignaturaService.obtenerPorEstudiante("estudiante456");

      expect(Asignatura.find).toHaveBeenCalledWith({
        estudiantesInscritos: "estudiante456",
      });
    });
  });

  // =========================================================
  // --- PRUEBAS PARA actualizarAsignatura
  // =========================================================
  describe("actualizarAsignatura", () => {
    test("Debería lanzar error si las ponderaciones actualizadas NO suman 100%", async () => {
      const datosActualizados = {
        evaluaciones: [
          { nombreEval: "Solemne 1", ponderacion: 30 },
          { nombreEval: "Solemne 2", ponderacion: 40 }, // Suma 70%
        ],
      };

      await expect(
        asignaturaService.actualizarAsignatura("asig123", datosActualizados),
      ).rejects.toThrow(
        "La suma de las ponderaciones actualizadas es 70%. Debe ser exactamente 100%.",
      );
    });

    test("Debería actualizar con éxito si las evaluaciones actualizadas suman exactamente 100%", async () => {
      const datosActualizados = {
        evaluaciones: [
          { nombreEval: "Solemne 1", ponderacion: 60 },
          { nombreEval: "Solemne 2", ponderacion: 40 }, // Suma 100%
        ],
      };

      mockQuery.then.mockImplementation(function (resolve) {
        resolve({
          _id: "asig123",
          nombreAsignatura: "Estructuras de Datos Renovada",
        });
      });

      const resultado = await asignaturaService.actualizarAsignatura(
        "asig123",
        datosActualizados,
      );

      expect(Asignatura.findByIdAndUpdate).toHaveBeenCalledWith(
        "asig123",
        datosActualizados,
        { new: true, runValidators: true },
      );
      expect(resultado.nombreAsignatura).toBe("Estructuras de Datos Renovada");
    });

    test("Debería actualizar con éxito si NO se modifican las evaluaciones (ej. cambiar solo periodo o docente)", async () => {
      const datosActualizados = {
        periodo: "2026-2",
        docente: "nuevoDocente999",
      };

      mockQuery.then.mockImplementation(function (resolve) {
        resolve({ _id: "asig123", periodo: "2026-2" });
      });

      const resultado = await asignaturaService.actualizarAsignatura(
        "asig123",
        datosActualizados,
      );

      expect(Asignatura.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(resultado.periodo).toBe("2026-2");
    });

    test("Debería retornar null si la asignatura solicitada para actualizar no existe en la BD", async () => {
      const datosActualizados = { nombreAsignatura: "Fantasía" };

      mockQuery.then.mockImplementation(function (resolve) {
        resolve(null);
      });

      const resultado = await asignaturaService.actualizarAsignatura(
        "idInexistente",
        datosActualizados,
      );
      expect(resultado).toBeNull();
    });
  });

  // =========================================================
  // --- PRUEBAS PARA eliminarAsignatura
  // =========================================================
  describe("eliminarAsignatura", () => {
    test("Debería llamar a findByIdAndDelete con el ID correcto y eliminar el ramo", async () => {
      const asignaturaEliminadaMock = {
        _id: "asig000",
        nombreAsignatura: "Ramo Borrado",
      };
      Asignatura.findByIdAndDelete.mockResolvedValue(asignaturaEliminadaMock);

      const resultado = await asignaturaService.eliminarAsignatura("asig000");

      expect(Asignatura.findByIdAndDelete).toHaveBeenCalledWith("asig000");
      expect(resultado).toEqual(asignaturaEliminadaMock);
    });

    test("Debería retornar null si se intenta eliminar una asignatura que no existe", async () => {
      Asignatura.findByIdAndDelete.mockResolvedValue(null);

      const resultado =
        await asignaturaService.eliminarAsignatura("idFalso999");

      expect(Asignatura.findByIdAndDelete).toHaveBeenCalledWith("idFalso999");
      expect(resultado).toBeNull();
    });
  });
});
