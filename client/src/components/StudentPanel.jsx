// src/components/StudentPanel.jsx
import React from "react";

export function StudentPanel({
  asignaturasEstudiante,
  calcularEstadoEstudiante,
}) {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

      {/* ── Header mejorado ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #004a99, #2b6cb0)",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "24px",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>
            🎓 Mi Progreso Académico Semestral
          </h3>
          <p style={{ margin: "4px 0 0 0", fontSize: "13px", opacity: 0.85 }}>
            Desglose de calificaciones, auditoría y proyecciones predictivas del periodo.
          </p>
        </div>
        <div
          style={{
            textAlign: "center",
            background: "rgba(255,255,255,0.15)",
            padding: "10px 18px",
            borderRadius: "10px",
          }}
        >
          <div style={{ fontSize: "22px", fontWeight: "bold" }}>
            {asignaturasEstudiante.length}
          </div>
          <div style={{ fontSize: "11px", opacity: 0.85 }}>
            Asignatura{asignaturasEstudiante.length !== 1 ? "s" : ""} inscrita{asignaturasEstudiante.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* ── Sin asignaturas ── */}
      {asignaturasEstudiante.length === 0 ? (
        <div
          style={{
            padding: "40px",
            border: "2px dashed #cbd5e0",
            borderRadius: "10px",
            textAlign: "center",
            color: "#718096",
            background: "white",
          }}
        >
          <div style={{ fontSize: "36px", marginBottom: "10px" }}>📭</div>
          <p style={{ margin: 0, fontSize: "14px" }}>
            No registras asignaturas inscritas para este periodo académico.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "20px",
          }}
        >
          {asignaturasEstudiante.map((asignatura) => {
            const estado = calcularEstadoEstudiante(asignatura);

            const promedioNumerico = parseFloat(estado.promedioAcumulado);
            const esPendiente = isNaN(promedioNumerico) || estado.promedioAcumulado === "-.-";
            const colorPromedio = esPendiente
              ? "#718096"
              : promedioNumerico < 4.0
              ? "#e53e3e"
              : "#38a169";

            const porcentajeEvaluado = 100 - estado.ponderacionRestante;

            // ── Configuración de alerta ──
            let cardBorder = "1px solid #cbd5e0";
            let alertBg = "#ebf8ff";
            let alertColor = "#2b6cb0";
            let alertIcon = "🎯";
            let alertTitle = "Proyección";
            let alertText = `Necesitas promediar un ${estado.notaNecesariaParaAprobar} en el ${estado.ponderacionRestante}% restante para aprobar.`;

            if (estado.reprobadoMatematicamente) {
              cardBorder = "2px solid #e53e3e";
              alertBg = "#fff5f5";
              alertColor = "#c53030";
              alertIcon = "🚨";
              alertTitle = "Riesgo Crítico";
              alertText = "Matemáticamente ya no es posible alcanzar la nota de aprobación (4.0).";
            } else if (estado.riesgoInminente) {
              cardBorder = "2px solid #dd6b20";
              alertBg = "#fffaf0";
              alertColor = "#c05621";
              alertIcon = "⚠️";
              alertTitle = "Alerta de Riesgo";
              alertText = `Requieres rendimiento alto. Necesitas un ${estado.notaNecesariaParaAprobar} en lo que resta.`;
            } else if (estado.aprobado) {
              cardBorder = "2px solid #38a169";
              alertBg = "#f0fff4";
              alertColor = "#22543d";
              alertIcon = "🎉";
              alertTitle = "¡Aprobado!";
              alertText = "Asignatura aprobada exitosamente al cierre del periodo.";
            } else if (estado.periodoTerminado && !estado.aprobado) {
              cardBorder = "2px solid #e53e3e";
              alertBg = "#fff5f5";
              alertColor = "#c53030";
              alertIcon = "❌";
              alertTitle = "Reprobado";
              alertText = "Asignatura reprobada al cierre definitivo del periodo.";
            }

            const tienePendientes = estado.notasDetalle.some((n) => n.nota === null);

            return (
              <div
                key={asignatura._id}
                style={{
                  background: "white",
                  borderRadius: "10px",
                  border: cardBorder,
                  boxShadow: "0 4px 6px rgba(0,0,0,0.04)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Cabecera de la tarjeta */}
                <div style={{ padding: "16px 18px 0" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, color: "#2d3748", fontSize: "15px", fontWeight: "bold" }}>
                        {asignatura.nombreAsignatura}
                      </h4>
                      <span style={{ fontSize: "11px", color: "#a0aec0" }}>
                        {asignatura.codigo} · Período: {asignatura.periodo || "2026-1"}
                      </span>
                    </div>
                    <div style={{ textAlign: "right", marginLeft: "12px" }}>
                      <div style={{ fontSize: "10px", color: "#718096", marginBottom: "2px" }}>
                        Promedio Act.
                      </div>
                      <div
                        style={{
                          fontSize: "26px",
                          fontWeight: "bold",
                          color: colorPromedio,
                          lineHeight: 1,
                        }}
                      >
                        {estado.promedioAcumulado}
                      </div>
                    </div>
                  </div>

                  {/* Barra de progreso */}
                  <div style={{ marginTop: "12px", marginBottom: "4px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "10px",
                        color: "#718096",
                        marginBottom: "4px",
                      }}
                    >
                      <span>Avance Evaluativo</span>
                      <span>{porcentajeEvaluado}% Completado</span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "7px",
                        background: "#edf2f7",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${porcentajeEvaluado}%`,
                          height: "100%",
                          background: porcentajeEvaluado === 100 ? "#38a169" : "#4299e1",
                          transition: "width 0.5s ease",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <hr style={{ border: "0", borderTop: "1px solid #edf2f7", margin: "12px 0" }} />

                {/* Desglose de notas */}
                <div style={{ padding: "0 18px", marginBottom: "14px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "bold", color: "#4a5568" }}>
                    📋 Registro Oficial de Calificaciones:
                  </span>

                  {/* Mensaje si todas están pendientes */}
                  {tienePendientes && porcentajeEvaluado === 0 && (
                    <div
                      style={{
                        marginTop: "8px",
                        padding: "8px 10px",
                        background: "#f7fafc",
                        borderRadius: "6px",
                        fontSize: "11px",
                        color: "#718096",
                        fontStyle: "italic",
                        border: "1px dashed #cbd5e0",
                        textAlign: "center",
                      }}
                    >
                      ⏳ Aún no hay calificaciones registradas para este ramo.
                    </div>
                  )}

                  <div style={{ marginTop: "8px", display: "grid", gap: "5px" }}>
                    {estado.notasDetalle.map((notaObj, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          background: notaObj.nota !== null ? "#f7fafc" : "#fafafa",
                          padding: "8px 10px",
                          borderRadius: "6px",
                          border: notaObj.nota !== null ? "1px solid #edf2f7" : "1px dashed #e2e8f0",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "12px",
                          }}
                        >
                          <span style={{ color: "#4a5568", fontWeight: "500" }}>
                            {notaObj.nombreEval}{" "}
                            <span style={{ fontSize: "10px", color: "#a0aec0", fontWeight: "normal" }}>
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
                            {notaObj.nota !== null ? notaObj.nota.toFixed(1) : "Pendiente"}
                          </strong>
                        </div>
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

                {/* ── Indicador predictivo prominente ── */}
                <div
                  style={{
                    margin: "0 12px 12px",
                    background: alertBg,
                    border: `1.5px solid ${alertColor}40`,
                    borderRadius: "10px",
                    padding: "12px 14px",
                    marginTop: "auto",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "4px",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>{alertIcon}</span>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "bold",
                        color: alertColor,
                      }}
                    >
                      {alertTitle}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      color: alertColor,
                      lineHeight: "1.5",
                      paddingLeft: "24px",
                    }}
                  >
                    {alertText}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
