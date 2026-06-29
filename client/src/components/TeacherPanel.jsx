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
  // Helper para extraer string seguro de un campo
  const getString = (val) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object")
      return val.nombre || val.correo || val._id || "";
    return String(val);
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Título */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h3 style={{ margin: 0, fontSize: "20px", color: "#2d3748" }}>
          👨‍🏫 Módulo de Calificaciones Docente
        </h3>
        <p style={{ color: "#718096", marginTop: "6px", fontSize: "14px" }}>
          Seleccione una de sus asignaturas titulares para abrir la planilla de
          notas del semestre.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "20px",
        }}
      >
        {/* ── Columna izquierda: lista de ramos ── */}
        <div
          style={{
            background: "white",
            padding: "16px",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
            alignSelf: "start",
          }}
        >
          <h4
            style={{
              margin: "0 0 12px 0",
              color: "#2d3748",
              fontSize: "14px",
              fontWeight: "bold",
              borderBottom: "2px solid #ebf8ff",
              paddingBottom: "8px",
            }}
          >
            📚 Mis Asignaturas
          </h4>

          {asignaturasDocente.length === 0 ? (
            <p
              style={{
                fontSize: "12px",
                color: "#718096",
                fontStyle: "italic",
              }}
            >
              No tienes asignaturas asignadas en este periodo.
            </p>
          ) : (
            asignaturasDocente.map((ramo) => {
              const activo = asignaturaActiva?._id === ramo._id;
              const nAlumnos = ramo.estudiantesInscritos?.length || 0;
              return (
                <button
                  key={ramo._id}
                  onClick={() => setAsignaturaActiva(ramo)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 12px",
                    marginBottom: "8px",
                    borderRadius: "8px",
                    border: activo ? "2px solid #004a99" : "1px solid #e2e8f0",
                    backgroundColor: activo ? "#ebf8ff" : "white",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: activo
                      ? "0 2px 8px rgba(0,74,153,0.15)"
                      : "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: activo ? "bold" : "600",
                      color: activo ? "#004a99" : "#2d3748",
                      marginBottom: "3px",
                    }}
                  >
                    📘 {ramo.nombreAsignatura}
                  </div>
                  <div style={{ fontSize: "11px", color: "#718096" }}>
                    Código: {ramo.codigo}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: activo ? "#2b6cb0" : "#a0aec0",
                      marginTop: "2px",
                    }}
                  >
                    👥 {nAlumnos} alumno{nAlumnos !== 1 ? "s" : ""}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* ── Columna derecha: planilla ── */}
        <div>
          {!asignaturaActiva ? (
            <div
              style={{
                height: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px dashed #e2e8f0",
                borderRadius: "10px",
                color: "#a0aec0",
                textAlign: "center",
                background: "white",
              }}
            >
              <div>
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>🎯</div>
                <p style={{ fontSize: "14px" }}>
                  Selecciona un ramo para ver la planilla
                </p>
              </div>
            </div>
          ) : (
            <div
              style={{
                background: "white",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                overflow: "hidden",
              }}
            >
              {/* Header de la planilla */}
              <div
                style={{
                  background: "linear-gradient(135deg, #004a99, #2b6cb0)",
                  padding: "16px 20px",
                  color: "white",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {asignaturaActiva.nombreAsignatura}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      opacity: 0.85,
                      marginTop: "2px",
                    }}
                  >
                    Código: {asignaturaActiva.codigo} · Docente:{" "}
                    {getString(asignaturaActiva.docente?.nombre) || "—"}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "12px",
                      background: "rgba(255,255,255,0.2)",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      marginBottom: "4px",
                    }}
                  >
                    📅 {asignaturaActiva.periodo}
                  </div>
                  <div style={{ fontSize: "11px", opacity: 0.8 }}>
                    👥 {asignaturaActiva.estudiantesInscritos?.length || 0}{" "}
                    alumnos
                  </div>
                </div>
              </div>

              {/* Mensaje de éxito/error */}
              {msgNotas && (
                <div
                  style={{
                    padding: "10px 20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    backgroundColor: msgNotas.includes("Error")
                      ? "#fff5f5"
                      : "#f0fff4",
                    color: msgNotas.includes("Error") ? "#c53030" : "#22543d",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  {msgNotas}
                </div>
              )}

              {/* Tabla */}
              <div style={{ overflowX: "auto", padding: "16px" }}>
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
                          padding: "10px 14px",
                          textAlign: "left",
                          borderRadius: "6px 0 0 0",
                          minWidth: "160px",
                        }}
                      >
                        Estudiante
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
                          borderRadius: "0 6px 0 0",
                        }}
                      >
                        Pond. Final
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {asignaturaActiva.estudiantesInscritos?.map(
                      (alumno, rowIdx) => {
                        const promedio = calcularPromedioPonderado(alumno._id);
                        const promedioNum = parseFloat(promedio);
                        const colorPromedio = isNaN(promedioNum)
                          ? "#718096"
                          : promedioNum < 4.0
                            ? "#e53e3e"
                            : "#38a169";

                        return (
                          <tr
                            key={alumno._id}
                            style={{
                              backgroundColor:
                                rowIdx % 2 === 0 ? "white" : "#f7fafc",
                              borderBottom: "1px solid #edf2f7",
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#ebf8ff")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                rowIdx % 2 === 0 ? "white" : "#f7fafc")
                            }
                          >
                            <td style={{ padding: "10px 14px" }}>
                              <strong
                                style={{ color: "#2d3748", fontSize: "13px" }}
                              >
                                {getString(alumno.nombre)}
                              </strong>
                              <br />
                              <span
                                style={{ color: "#a0aec0", fontSize: "11px" }}
                              >
                                {getString(alumno.correo)}
                              </span>
                            </td>

                            {asignaturaActiva.evaluaciones?.map((ev, idx) => {
                              const registro = buscarNotaEnBase(
                                alumno._id,
                                ev.nombreEval,
                              );
                              return (
                                <td
                                  key={idx}
                                  style={{
                                    padding: "8px",
                                    textAlign: "center",
                                  }}
                                >
                                  <input
                                    type="number"
                                    step="0.1"
                                    min="1.0"
                                    max="7.0"
                                    placeholder="—"
                                    defaultValue={
                                      registro ? registro.calificacion : ""
                                    }
                                    onBlur={(e) =>
                                      guardarNotaServidor(
                                        alumno._id,
                                        ev.nombreEval,
                                        e.target.value,
                                      )
                                    }
                                    style={{
                                      width: "65px",
                                      padding: "6px",
                                      textAlign: "center",
                                      borderRadius: "6px",
                                      border: "1px solid #cbd5e0",
                                      fontSize: "13px",
                                      color: "#2d3748",
                                      background: "white",
                                      outline: "none",
                                      transition: "border 0.2s",
                                    }}
                                    onFocus={(e) =>
                                      (e.target.style.border =
                                        "1px solid #004a99")
                                    }
                                    onBlurCapture={(e) =>
                                      (e.target.style.border =
                                        "1px solid #cbd5e0")
                                    }
                                  />
                                  {registro?.modificadoPor && (
                                    <div
                                      style={{
                                        fontSize: "9px",
                                        color: "#a0aec0",
                                        marginTop: "2px",
                                      }}
                                    >
                                      ✍️ {getString(registro.modificadoPor)}
                                    </div>
                                  )}
                                </td>
                              );
                            })}

                            {/* Promedio final con color */}
                            <td
                              style={{
                                padding: "10px",
                                textAlign: "center",
                                backgroundColor: "#f7fafc",
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "15px",
                                  color: colorPromedio,
                                }}
                              >
                                {promedio}
                              </span>
                            </td>
                          </tr>
                        );
                      },
                    )}
                  </tbody>
                </table>

                {/* Si no hay alumnos */}
                {(!asignaturaActiva.estudiantesInscritos ||
                  asignaturaActiva.estudiantesInscritos.length === 0) && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#a0aec0",
                      fontSize: "13px",
                    }}
                  >
                    📭 No hay alumnos inscritos en esta asignatura.
                  </div>
                )}
              </div>

              {/* Footer con tip */}
              <div
                style={{
                  margin: "0 16px 16px",
                  background: "#ebf8ff",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #bee3f8",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: "14px" }}>💡</span>
                <span style={{ fontSize: "12px", color: "#2c5282" }}>
                  <strong>Tips de Uso:</strong> Cambia cualquier nota y haz clic
                  fuera del cuadro para guardarla. El promedio se recalcula al
                  instante.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
