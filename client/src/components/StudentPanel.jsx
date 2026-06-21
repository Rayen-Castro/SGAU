// src/components/StudentPanel.jsx
import React from "react";

export function StudentPanel({
  asignaturasEstudiante,
  calcularEstadoEstudiante,
}) {
  return (
    <div>
      <h3>🎓 Mi Progreso Académico Semestral</h3>
      <p style={{ color: "#4a5568", marginTop: "-10px", fontSize: "14px" }}>
        A continuación, se presenta el desglose analítico de tus calificaciones,
        auditoría de registros y las proyecciones predictivas para el cierre del
        periodo.
      </p>

      {asignaturasEstudiante.length === 0 ? (
        <div
          style={{
            padding: "30px",
            border: "2px dashed #cbd5e0",
            borderRadius: "8px",
            textAlign: "center",
            color: "#718096",
          }}
        >
          📭 No registras asignaturas inscritas para este periodo académico.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {asignaturasEstudiante.map((asignatura) => {
            // Ejecución del algoritmo predictivo del Hook
            const estado = calcularEstadoEstudiante(asignatura);

            // Cálculo seguro para el color del promedio acumulado
            const promedioNumerico = parseFloat(estado.promedioAcumulado);
            const esPendiente = isNaN(promedioNumerico);
            const colorPromedio = esPendiente
              ? "#718096" // Gris si no hay notas
              : promedioNumerico < 4.0
                ? "#e53e3e" // Rojo si va reprobando
                : "#38a169"; // Verde si va aprobando

            // Porcentaje del ramo que ya ha sido evaluado
            const porcentajeEvaluado = 100 - estado.ponderacionRestante;

            // =========================================================
            // MANEJO DINÁMICO DE ALERTAS PREDICTIVAS (Sincronizado con Hook)
            // =========================================================
            let cardBorder = "1px solid #cbd5e0";
            let alertBg = "#ebf8ff";
            let alertColor = "#2b6cb0";
            let alertText = `🎯 Necesitas promediar un ${estado.notaNecesariaParaAprobar} en el ${estado.ponderacionRestante}% restante para aprobar.`;

            if (estado.reprobadoMatematicamente) {
              cardBorder = "2px solid #e53e3e";
              alertBg = "#fff5f5";
              alertColor = "#c53030";
              alertText =
                "🚨 Riesgo Crítico: Matemáticamente ya no es posible alcanzar la nota de aprobación (4.0).";
            } else if (estado.riesgoInminente) {
              cardBorder = "2px solid #dd6b20";
              alertBg = "#fffaf0";
              alertColor = "#dd6b20";
              alertText = `⚠️ Alerta de Riesgo: Requieres un rendimiento alto. Nota mínima necesaria restante: ${estado.notaNecesariaParaAprobar}`;
            } else if (estado.aprobado) {
              cardBorder = "2px solid #38a169";
              alertBg = "#f0fff4";
              alertColor = "#22543d";
              alertText =
                "🎉 ¡Asignatura aprobada exitosamente al cierre del periodo!";
            } else if (estado.periodoTerminado && !estado.aprobado) {
              cardBorder = "2px solid #e53e3e";
              alertBg = "#fff5f5";
              alertColor = "#c53030";
              alertText =
                "❌ Asignatura reprobada al cierre definitivo del periodo.";
            }

            return (
              <div
                key={asignatura._id}
                style={{
                  background: "white",
                  borderRadius: "10px",
                  border: cardBorder,
                  boxShadow: "0 4px 6px rgba(0,0,0,0.03)",
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* Cabecera del Ramo */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          margin: 0,
                          color: "#2d3748",
                          fontSize: "15px",
                        }}
                      >
                        {asignatura.nombreAsignatura}
                      </h4>
                      <span style={{ fontSize: "11px", color: "#a0aec0" }}>
                        Código: {asignatura.codigo} | Período:{" "}
                        {asignatura.periodo || "2026-1"}
                      </span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "11px", color: "#718096" }}>
                        Promedio Act.
                      </span>
                      <div
                        style={{
                          fontSize: "22px",
                          fontWeight: "bold",
                          color: colorPromedio,
                        }}
                      >
                        {estado.promedioAcumulado}
                      </div>
                    </div>
                  </div>

                  {/* Barra de Progreso de Evaluaciones del Semestre */}
                  <div style={{ marginTop: "10px", marginBottom: "5px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "10px",
                        color: "#718096",
                      }}
                    >
                      <span>Avance Evaluativo</span>
                      <span>{porcentajeEvaluado}% Completado</span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "6px",
                        background: "#edf2f7",
                        borderRadius: "3px",
                        overflow: "hidden",
                        marginTop: "3px",
                      }}
                    >
                      <div
                        style={{
                          width: `${porcentajeEvaluado}%`,
                          height: "100%",
                          background: "#4299e1",
                          transition: "width 0.5s ease",
                        }}
                      />
                    </div>
                  </div>

                  <hr
                    style={{
                      border: "0",
                      borderTop: "1px solid #edf2f7",
                      margin: "12px 0",
                    }}
                  />

                  {/* Desglose de Calificaciones + Auditoría */}
                  <div style={{ marginBottom: "15px" }}>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#4a5568",
                      }}
                    >
                      📋 Registro Oficial de Calificaciones:
                    </span>

                    <div
                      style={{ marginTop: "6px", display: "grid", gap: "6px" }}
                    >
                      {estado.notasDetalle.map((notaObj, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            background: "#f7fafc",
                            padding: "8px 10px",
                            borderRadius: "6px",
                            border: "1px solid #edf2f7",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: "12px",
                            }}
                          >
                            <span
                              style={{ color: "#4a5568", fontWeight: "500" }}
                            >
                              {notaObj.nombreEval}{" "}
                              <span
                                style={{
                                  fontSize: "10px",
                                  color: "#a0aec0",
                                  fontWeight: "normal",
                                }}
                              >
                                ({notaObj.ponderacion}%)
                              </span>
                            </span>
                            <strong
                              style={{
                                color:
                                  notaObj.nota !== null
                                    ? notaObj.nota < 4.0
                                      ? "#e53e3e"
                                      : "#2b6cb0"
                                    : "#a0aec0",
                              }}
                            >
                              {notaObj.nota !== null
                                ? notaObj.nota.toFixed(1)
                                : "Pendiente"}
                            </strong>
                          </div>

                          {/* Muestra de Auditoría si la nota ya fue ingresada por un Profesor */}
                          {notaObj.nota !== null && notaObj.modificadoPor && (
                            <span
                              style={{
                                fontSize: "9px",
                                color: "#718096",
                                marginTop: "2px",
                                fontStyle: "italic",
                              }}
                            >
                              ✍️ Firmado por: {notaObj.modificadoPor}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contenedor del Algoritmo Predictivo */}
                <div
                  style={{
                    background: alertBg,
                    color: alertColor,
                    padding: "12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: "500",
                    border: `1px solid ${alertColor}25`,
                    lineHeight: "1.45",
                  }}
                >
                  {alertText}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
