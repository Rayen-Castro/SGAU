// tests/gradeService.test.js
const gradeService = require("../server/services/gradeService");
const grade = require("../server/models/grade");

// Definimos el mock encapsulando todo adentro para evitar errores de memoria (Hoisting)
jest.mock("../server/models/grade", () => {
  // 1. Simulamos el constructor de Mongoose
  const MockModel = function (datos) {
    // Esto copia los datos (estudianteId, calificacion, etc.) al objeto vacío
    Object.assign(this, datos);
    // Simulamos el método save()
    this.save = jest.fn().mockResolvedValue(true);
  };

  // 2. Simulamos el método estático
  MockModel.findOne = jest.fn();

  return MockModel;
});

describe("Pruebas unitarias para gradeService - guardarCalificacion", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Debería lanzar un error si la calificación es menor a 1.0", async () => {
    const datosInvalido = {
      estudianteId: "60d5ecb54ddae40a9c8b4561",
      asignaturaId: "60d5ecb54ddae40a9c8b4562",
      nombreEval: "Solemne 1",
      calificacion: 0.5,
      profesorId: "60d5ecb54ddae40a9c8b4563",
    };

    await expect(
      gradeService.guardarCalificacion(datosInvalido),
    ).rejects.toThrow("La calificación debe estar entre 1.0 y 7.0");
  });

  test("Debería crear una nueva nota con éxito si no existía previamente", async () => {
    const datosValidos = {
      estudianteId: "60d5ecb54ddae40a9c8b4561",
      asignaturaId: "60d5ecb54ddae40a9c8b4562",
      nombreEval: "Solemne 1",
      calificacion: 6.5,
      profesorId: "60d5ecb54ddae40a9c8b4563",
    };

    // Le decimos al mock qué devolver cuando se llame a findOne
    grade.findOne.mockResolvedValue(null);

    const resultado = await gradeService.guardarCalificacion(datosValidos);

    // Verificaciones
    expect(resultado.accion).toBe("creada");
    expect(resultado.nota.calificacion).toBe(6.5);
    expect(grade.findOne).toHaveBeenCalledTimes(1);
  });
});
