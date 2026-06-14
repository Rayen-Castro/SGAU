// src/components/StudentPanel.jsx
import React from "react";

export function StudentPanel({
  asignaturasEstudiante,
  calcularEstadoEstudiante,
}) {
  return (
    <div>
      <h3>🎓 Mi Progreso Académico Semestral</h3>
      <p style={{ color: "#4a5568", marginTop: "-10px" }}>
        A continuación, se presenta el desglose analítico de tus calificaciones
        y las proyecciones para el cierre del periodo.
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
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {asignaturasEstudiante.map((asignatura) => {
            // Pasamos la asignatura por el algoritmo predictivo del hook
            const estado = calcularEstadoEstudiante(asignatura);

            // Definición dinámica de colores de alerta según el riesgo
            let cardBorder = "1px solid #cbd5e0";
            let alertBg = "#ebf8ff";
            let alertColor = "#2b6cb0";
            let alertText = `🎯 Necesitas un ${estado.notaNecesariaParaAprobar} en el ${estado.ponderacionRestante}% restante para aprobar.`;

            if (estado.yaReproboMatematicamente) {
              cardBorder = "2px solid #e53e3e";
              alertBg = "#fff5f5";
              alertColor = "#c53030";
              alertText =
                "🚨 Riesgo Crítico: Matemáticamente no es posible alcanzar la nota de aprobación (4.0).";
            } else if (estado.riesgoImminente) {
              cardBorder = "2px solid #dd6b20";
              alertBg = "#fffaf0";
              alertColor = "#dd6b20";
              alertText = `⚠️ Alerta de Riesgo: Requieres un esfuerzo alto. Nota mínima restante: ${estado.notaNecesariaParaAprobar}`;
            } else if (estado.aprobado) {
              cardBorder = "2px solid #38a169";
              alertBg = "#f0fff4";
              alertColor = "#22543d";
              alertText = "🎉 ¡Asignatura aprobada exitosamente!";
            } else if (estado.ponderacionRestante === 0 && !estado.aprobado) {
              cardBorder = "2px solid #e53e3e";
              alertBg = "#fff5f5";
              alertColor = "#c53030";
              alertText = "❌ Asignatura reprobada al cierre del periodo.";
            }

            return (
              <div
                key={asignatura._id}
                style={{
                  background: "white",
                  borderRadius: "10px",
                  border: cardBorder,
                  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* Cabecera de la Tarjeta */}
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
                        Código: {asignatura.codigo}
                      </span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "11px", color: "#718096" }}>
                        Promedio Act.
                      </span>
                      <div
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          color:
                            parseFloat(estado.promedioAcumulado) < 4.0
                              ? "#e53e3e"
                              : "#38a169",
                        }}
                      >
                        {estado.promedioAcumulado}
                      </div>
                    </div>
                  </div>

                  <hr
                    style={{
                      border: "0",
                      borderTop: "1px solid #edf2f7",
                      margin: "12px 0",
                    }}
                  />

                  {/* Desglose de Notas */}
                  <div style={{ marginBottom: "15px" }}>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#4a5568",
                      }}
                    >
                      📋 Calificaciones obtenidas:
                    </span>
                    <div
                      style={{ marginTop: "6px", display: "grid", gap: "6px" }}
                    >
                      {estado.notasDetalle.map((notaObj, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "12px",
                            background: "#f7fafc",
                            padding: "6px 10px",
                            borderRadius: "4px",
                          }}
                        >
                          <span style={{ color: "#4a5568" }}>
                            {notaObj.nombreEval}{" "}
                            <span
                              style={{ fontSize: "10px", color: "#a0aec0" }}
                            >
                              ({notaObj.ponderacion}%)
                            </span>
                          </span>
                          <strong
                            style={{
                              color: notaObj.nota
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
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contenedor del Indicador Predictivo / Alerta Visual */}
                <div
                  style={{
                    background: alertBg,
                    color: alertColor,
                    padding: "10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "5px",
                    border: `1px solid ${alertColor}33`,
                    lineHeight: "1.4",
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
