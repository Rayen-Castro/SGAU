// tests/gradeService.test.js
const gradeService = require("../services/gradeService");
const Grade = require("../models/Grade");

// Le decimos a Jest que simule (mockee) el modelo de la Base de Datos
// para no conectarnos a una BD real durante el test unitario
jest.mock("../models/Grade");

describe("Pruebas unitarias para gradeService - guardarCalificacion", () => {
  // Test 1: Caso de error (Nota inválida)
  test("Debería lanzar un error si la calificación es menor a 1.0", async () => {
    const datosInvalido = {
      estudianteId: "123",
      asignaturaId: "456",
      nombreEval: "Solemne 1",
      calificacion: 0.5, // Nota inválida
      profesorId: "789",
    };

    // Esperamos que la función falle con el mensaje correcto
    await expect(
      gradeService.guardarCalificacion(datosInvalido),
    ).rejects.toThrow("La calificación debe estar entre 1.0 y 7.0");
  });

  // Test 2: Caso de éxito (Crear nueva nota)
  test("Debería crear una nueva nota con éxito si no existía previamente", async () => {
    const datosValidos = {
      estudianteId: "123",
      asignaturaId: "456",
      nombreEval: "Solemne 1",
      calificacion: 6.5,
      profesorId: "789",
    };

    // Simulamos que la base de datos NO encuentra ninguna nota previa
    Grade.findOne.mockResolvedValue(null);

    // Simulamos el comportamiento del método save() de Mongoose
    Grade.prototype.save = jest.fn().mockResolvedValue(true);

    const resultado = await gradeService.guardarCalificacion(datosValidos);

    // Verificaciones (Assertions)
    expect(resultado.accion).toBe("creada");
    expect(resultado.nota.calificacion).toBe(6.5);
  });
});
