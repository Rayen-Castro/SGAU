// src/components/TeacherPanel.jsx
import React from "react";

export function TeacherPanel({
  asignaturasDocente,
  asignaturaActiva,
  setAsignaturaActiva,
  msgNotas,
  buscarNotaEnBase,
  guardarNotaServidor,
  calcularPromedioPonderado,
}) {
  return (
    <div>
      <h3>👨‍🏫 Módulo de Calificaciones Docente</h3>
      <p style={{ color: "#4a5568", marginTop: "-10px" }}>
        Seleccione una de sus asignaturas titulares para abrir la planilla de
        notas del semestre.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {/* Columna Izquierda: Listado de Ramos */}
        <div
          style={{
            background: "#f7fafc",
            padding: "15px",
            borderRadius: "8px",
            border: "1px solid #cbd5e0",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0", color: "#2d3748" }}>
            Mis Asignaturas
          </h4>
          {asignaturasDocente.length === 0 ? (
            <p
              style={{
                fontSize: "12px",
                color: "#718096",
                fontStyle: "italic",
              }}
            >
              No tienes asignaturas asignadas en este periodo académico.
            </p>
          ) : (
            asignaturasDocente.map((ramo) => (
              <button
                key={ramo._id}
                onClick={() => setAsignaturaActiva(ramo)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "10px",
                  marginBottom: "8px",
                  borderRadius: "6px",
                  border:
                    asignaturaActiva?._id === ramo._id
                      ? "2px solid #004a99"
                      : "1px solid #cbd5e0",
                  backgroundColor:
                    asignaturaActiva?._id === ramo._id ? "#ebf8ff" : "white",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight:
                    asignaturaActiva?._id === ramo._id ? "bold" : "normal",
                  transition: "all 0.2s",
                }}
              >
                📘 {ramo.nombreAsignatura}
                <br />
                <span style={{ color: "#718096", fontSize: "11px" }}>
                  Código: {ramo.codigo}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Columna Derecha: Planilla Interactiva */}
        <div>
          {!asignaturaActiva ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px dashed #e2e8f0",
                borderRadius: "8px",
                color: "#718096",
                padding: "40px",
                textAlign: "center",
              }}
            >
              <div>
                <span style={{ fontSize: "30px" }}>🎯</span>
                <p>
                  Por favor, seleccione un ramo de la lista lateral para
                  visualizar la planilla.
                </p>
              </div>
            </div>
          ) : (
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #cbd5e0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <h4 style={{ margin: 0, color: "#2b6cb0", fontSize: "16px" }}>
                  Planilla Semestral: {asignaturaActiva.nombreAsignatura} (
                  {asignaturaActiva.codigo})
                </h4>
                <span
                  style={{
                    fontSize: "12px",
                    background: "#edf2f7",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontWeight: "bold",
                  }}
                >
                  Periodo: {asignaturaActiva.periodo}
                </span>
              </div>

              {msgNotas && (
                <div
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    marginBottom: "15px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    backgroundColor: msgNotas.includes("Error")
                      ? "#fed7d7"
                      : "#c6f6d5",
                    color: msgNotas.includes("Error") ? "#9b2c2c" : "#22543d",
                  }}
                >
                  {msgNotas}
                </div>
              )}

              {/* Contenedor de la Tabla */}
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "13px",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#004a99", color: "white" }}>
                      <th
                        style={{
                          padding: "10px",
                          textAlign: "left",
                          borderRadius: "4px 0 0 0",
                        }}
                      >
                        Estudiante / Correo
                      </th>
                      {asignaturaActiva.evaluaciones?.map((ev, idx) => (
                        <th
                          key={idx}
                          style={{
                            padding: "10px",
                            textAlign: "center",
                            width: "110px",
                          }}
                        >
                          {ev.nombreEval}
                          <br />
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: "normal",
                              opacity: 0.8,
                            }}
                          >
                            ({ev.ponderacion}%)
                          </span>
                        </th>
                      ))}
                      <th
                        style={{
                          padding: "10px",
                          textAlign: "center",
                          width: "100px",
                          backgroundColor: "#2b6cb0",
                          borderRadius: "0 4px 0 0",
                        }}
                      >
                        Pond. Final
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {asignaturaActiva.estudiantes?.map((alumno) => (
                      <tr
                        key={alumno._id}
                        style={{ borderBottom: "1px solid #e2e8f0" }}
                      >
                        <td style={{ padding: "10px" }}>
                          <strong style={{ color: "#2d3748" }}>
                            {alumno.nombre}
                          </strong>
                          <br />
                          <span style={{ color: "#718096", fontSize: "11px" }}>
                            {alumno.correo}
                          </span>
                        </td>

                        {/* Render dinámico de celdas para evaluaciones */}
                        {asignaturaActiva.evaluaciones?.map((ev, idx) => {
                          const registroNota = buscarNotaEnBase(
                            alumno._id,
                            ev.nombreEval,
                          );
                          return (
                            <td
                              key={idx}
                              style={{ padding: "10px", textAlign: "center" }}
                            >
                              <input
                                type="number"
                                step="0.1"
                                min="1.0"
                                max="7.0"
                                placeholder="1.0 - 7.0"
                                defaultValue={
                                  registroNota ? registroNota.calificacion : ""
                                }
                                onBlur={(e) =>
                                  guardarNotaServidor(
                                    alumno._id,
                                    ev.nombreEval,
                                    e.target.value,
                                  )
                                }
                                style={{
                                  width: "70px",
                                  padding: "6px",
                                  textAlign: "center",
                                  borderRadius: "4px",
                                  border: "1px solid #cbd5e0",
                                  fontSize: "12px",
                                }}
                              />
                              {registroNota?.modificadoPor && (
                                <div
                                  style={{
                                    fontSize: "9px",
                                    color: "#a0aec0",
                                    marginTop: "3px",
                                  }}
                                >
                                  Mod: {registroNota.modificadoPor}
                                </div>
                              )}
                            </td>
                          );
                        })}

                        {/* Celda del Promedio */}
                        <td
                          style={{
                            padding: "10px",
                            textAlign: "center",
                            fontWeight: "bold",
                            color: "#2b6cb0",
                            backgroundColor: "#f7fafc",
                          }}
                        >
                          {calcularPromedioPonderado(alumno._id)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Panel Informativo Inferior */}
              <div
                style={{
                  marginTop: "20px",
                  background: "#ebf8ff",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "1px solid #bee3f8",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span style={{ fontSize: "16px" }}>💡</span>
                <span style={{ fontSize: "12px", color: "#2c5282" }}>
                  <strong>Tips de Uso:</strong> Cambia cualquier nota y haz clic
                  fuera del cuadro (o presiona Tabulador) para guardarla. El
                  promedio se recalcula al instante y la marca temporal de
                  auditoría se actualiza de inmediato.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
