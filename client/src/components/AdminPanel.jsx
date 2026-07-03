// src/components/AdminPanel.jsx
import React from "react";

export function AdminPanel({
  // Props Registro Usuarios
  msgRegistro,
  nuevoUsuario,
  setNuevoUsuario,
  carrerasDisponibles,
  manejarRegistroUsuario,
  listaUsuarios,

  // Props Configuración Asignaturas
  msgAsignatura,
  nombreAsignatura,
  setNombreAsignatura,
  codigoAsignatura,
  setCodigoAsignatura,
  periodo,
  setPeriodo,
  docenteSeleccionado,
  setDocenteSeleccionado,
  evaluaciones,
  agregarFilaEvaluacion,
  eliminarFilaEvaluacion,
  actualizarFilaEvaluacion,
  carreraFiltradaAdmin,
  setCarreraFiltradaAdmin,
  estudiantesDisponibles,
  estudiantesSeleccionados,
  manejarCheckboxEstudiante,
  manejarCrearAsignatura,
  manejarEliminarAsignatura,
  idAsignaturaEditando,
  activarModoEdicion,
  cancelarEdicion,
  manejarActualizarAsignatura,
  docentesDisponibles,
  listaAsignaturas,
  tieneAyudantia,
  ayudanteSeleccionado,
  tieneExamenIntegral,
  porcentajeExamenIntegral,
  facultadesYCarreras,
  facultadRamo,
  setFacultadRamo,
  carreraRamo,
  setCarreraRamo,
}) {
  // Estilos locales encapsulados
  const inputStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "2px",
    borderRadius: "6px",
    border: "1px solid #cbd5e0",
    boxSizing: "border-box",
    fontSize: "13px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "40px" }}>
      {/* ========================================================= */}
      {/* SECCIÓN 1: GESTIÓN DE USUARIOS (HITO 1)                  */}
      {/* ========================================================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          borderBottom: "2px dashed #e2e8f0",
          paddingBottom: "30px",
        }}
      >
        {/* Formulario de Registro */}
        <div>
          <h3>⚙️ Registrar Nuevo Usuario (Hito 1)</h3>
          {msgRegistro && (
            <p
              style={{
                padding: "10px",
                borderRadius: "5px",
                backgroundColor: "#edf2f7",
                fontWeight: "bold",
                fontSize: "13px",
              }}
            >
              {msgRegistro}
            </p>
          )}
          <form
            onSubmit={manejarRegistroUsuario}
            style={{
              display: "grid",
              gap: "12px",
              background: "#f7fafc",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          >
            {/* SECCIÓN DE NOMBRES */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "8px",
              }}
            >
              <input
                type="text"
                placeholder="Primer Nombre"
                required
                value={nuevoUsuario.primerNombre || ""}
                onChange={(e) =>
                  setNuevoUsuario({
                    ...nuevoUsuario,
                    primerNombre: e.target.value,
                  })
                }
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Segundo Nombre"
                required
                value={nuevoUsuario.segundoNombre || ""}
                onChange={(e) =>
                  setNuevoUsuario({
                    ...nuevoUsuario,
                    segundoNombre: e.target.value,
                  })
                }
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Tercer Nombre (Opc.)"
                value={nuevoUsuario.tercerNombre || ""}
                onChange={(e) =>
                  setNuevoUsuario({
                    ...nuevoUsuario,
                    tercerNombre: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            {/* SECCIÓN DE APELLIDOS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
              }}
            >
              <input
                type="text"
                placeholder="Primer Apellido"
                required
                value={nuevoUsuario.primerApellido || ""}
                onChange={(e) =>
                  setNuevoUsuario({
                    ...nuevoUsuario,
                    primerApellido: e.target.value,
                  })
                }
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Segundo Apellido"
                required
                value={nuevoUsuario.segundoApellido || ""}
                onChange={(e) =>
                  setNuevoUsuario({
                    ...nuevoUsuario,
                    segundoApellido: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            <hr style={{ borderTop: "1px dashed #cbd5e0", margin: "5px 0" }} />

            {/* SECCIÓN DE ROLES Y CARRERA */}
            <select
              value={nuevoUsuario.rol}
              onChange={(e) =>
                setNuevoUsuario({
                  ...nuevoUsuario,
                  rol: e.target.value,
                  carrera:
                    e.target.value === "Estudiante"
                      ? carrerasDisponibles[0]
                      : "",
                })
              }
              style={inputStyle}
            >
              <option value="Estudiante">Estudiante</option>
              <option value="Docente">Docente</option>
              <option value="Admin">Administrador</option>
            </select>

            {nuevoUsuario.rol === "Estudiante" && (
              <select
                value={nuevoUsuario.carrera}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, carrera: e.target.value })
                }
                style={inputStyle}
              >
                {carrerasDisponibles.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}

            <button
              type="submit"
              style={{
                ...buttonStyle,
                backgroundColor: "#2b6cb0",
                marginTop: "5px",
              }}
            >
              Guardar Usuario
            </button>
          </form>
        </div>

        {/* Tabla de Usuarios en la BD */}
        <div>
          <h3>Usuarios en Base de Datos</h3>
          <div
            style={{
              maxHeight: "230px",
              overflowY: "auto",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "13px",
              }}
            >
              <thead
                style={{
                  backgroundColor: "#edf2f7",
                  position: "sticky",
                  top: 0,
                }}
              >
                <tr>
                  <th style={{ padding: "8px", textAlign: "left" }}>Nombre</th>
                  <th style={{ padding: "8px", textAlign: "left" }}>Rol</th>
                  <th style={{ padding: "8px", textAlign: "left" }}>Carrera</th>
                </tr>
              </thead>
              <tbody>
                {listaUsuarios.map((u) => (
                  <tr key={u._id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "8px" }}>
                      <strong>{u.nombre}</strong>
                      <br />
                      <span style={{ color: "#718096", fontSize: "11px" }}>
                        {u.correo}
                      </span>
                    </td>
                    <td style={{ padding: "8px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          padding: "2px 5px",
                          borderRadius: "4px",
                          fontWeight: "bold",
                          backgroundColor:
                            u.rol === "Docente" ? "#feebc8" : "#e2f0d9",
                        }}
                      >
                        {u.rol}
                      </span>
                    </td>
                    <td style={{ padding: "8px" }}>{u.carrera || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECCIÓN 2: GESTIÓN DE ASIGNATURAS (HITO 2)                */}
      {/* ========================================================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: "30px",
        }}
      >
        {/* Formulario de Nueva Asignatura */}
        <div>
          <h3>Configurar Nueva Asignatura</h3>
          {msgAsignatura && (
            <p
              style={{
                padding: "10px",
                borderRadius: "5px",
                backgroundColor: "#e2e8f0",
                fontWeight: "bold",
                fontSize: "13px",
              }}
            >
              {msgAsignatura}
            </p>
          )}
          <form
            onSubmit={
              idAsignaturaEditando
                ? manejarActualizarAsignatura
                : manejarCrearAsignatura
            }
            style={{
              background: "#f7fafc",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #cbd5e0",
              display: "grid",
              gap: "12px",
            }}
          >
            {/* Selector Facultad → Carrera */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              <select
                value={facultadRamo}
                onChange={(e) => {
                  setFacultadRamo(e.target.value);
                  setCarreraRamo("");
                }}
                style={inputStyle}
              >
                <option value="">-- Seleccionar Facultad --</option>
                {Object.keys(facultadesYCarreras).map((fac) => (
                  <option key={fac} value={fac}>
                    {fac}
                  </option>
                ))}
              </select>

              <select
                value={carreraRamo}
                onChange={(e) => setCarreraRamo(e.target.value)}
                style={inputStyle}
                disabled={!facultadRamo}
              >
                <option value="">-- Seleccionar Carrera --</option>
                {(facultadesYCarreras[facultadRamo] || []).map((car) => (
                  <option key={car} value={car}>
                    {car}
                  </option>
                ))}
              </select>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "10px",
              }}
            >
              <input
                type="text"
                placeholder="Materia"
                required
                value={nombreAsignatura}
                onChange={(e) => setNombreAsignatura(e.target.value)}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Código"
                required
                value={codigoAsignatura}
                onChange={(e) => setCodigoAsignatura(e.target.value)}
                style={inputStyle}
              />
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                style={inputStyle}
              >
                <option value="2026-1">2026-1</option>
              </select>
            </div>

            <select
              value={docenteSeleccionado}
              onChange={(e) => setDocenteSeleccionado(e.target.value)}
              style={inputStyle}
            >
              <option value="">-- Asignar Docente --</option>
              {docentesDisponibles.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.nombre}
                </option>
              ))}
            </select>

            {/* Ayudantía */}
            <label
              style={{
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <input
                type="checkbox"
                checked={tieneAyudantia}
                onChange={(e) => setTieneAyudantia(e.target.checked)}
              />
              ¿El ramo tiene ayudantía?
            </label>

            {tieneAyudantia && (
              <select
                value={ayudanteSeleccionado}
                onChange={(e) => setAyudanteSeleccionado(e.target.value)}
                style={inputStyle}
              >
                <option value="">-- Seleccionar Ayudante --</option>
                {estudiantesDisponibles.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.nombre}
                  </option>
                ))}
              </select>
            )}

            {/* Examen Integral */}
            <label
              style={{
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <input
                type="checkbox"
                checked={tieneExamenIntegral}
                onChange={(e) => setTieneExamenIntegral(e.target.checked)}
              />
              ¿El ramo tiene examen integral?
            </label>

            {tieneExamenIntegral && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                }}
              >
                <span>Porcentaje base:</span>
                <input
                  type="number"
                  value={porcentajeExamenIntegral}
                  onChange={(e) =>
                    setPorcentajeExamenIntegral(Number(e.target.value))
                  }
                  style={{ ...inputStyle, width: "70px" }}
                  min={1}
                  max={100}
                />
                <span>%</span>
              </div>
            )}

            {/* Plan de Evaluaciones Dinámico */}
            <div>
              <button
                type="button"
                onClick={agregarFilaEvaluacion}
                style={{
                  float: "right",
                  fontSize: "12px",
                  background: "#38a169",
                  color: "white",
                  border: "none",
                  padding: "3px 6px",
                  borderRadius: "4px",
                }}
              >
                + Eval
              </button>
              <label style={{ fontSize: "13px", fontWeight: "bold" }}>
                Plan Evaluaciones:
              </label>
              {evaluaciones.map((ev, idx) => (
                <div
                  key={idx}
                  style={{ display: "flex", gap: "5px", marginTop: "5px" }}
                >
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={ev.nombreEval}
                    onChange={(e) =>
                      actualizarFilaEvaluacion(
                        idx,
                        "nombreEval",
                        e.target.value,
                      )
                    }
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    placeholder="%"
                    value={ev.ponderacion}
                    onChange={(e) =>
                      actualizarFilaEvaluacion(
                        idx,
                        "ponderacion",
                        e.target.value,
                      )
                    }
                    style={{ ...inputStyle, width: "70px" }}
                  />
                  <button
                    type="button"
                    onClick={() => eliminarFilaEvaluacion(idx)}
                    style={{
                      background: "#e53e3e",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Selección de Alumnos con Filtro de Carrera */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyBetween: "space-between",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label
                  style={{
                    fontSize: "13px",
                    fontWeight: "bold",
                    color: "#4a5568",
                  }}
                >
                  Inscribir Alumnos:
                </label>
                <div style={{ fontSize: "11px" }}>
                  <span style={{ color: "#718096", marginRight: "5px" }}>
                    Carrera:
                  </span>
                  <select
                    value={carreraFiltradaAdmin}
                    style={{
                      padding: "2px 4px",
                      borderRadius: "4px",
                      border: "1px solid #cbd5e0",
                      fontSize: "11px",
                      backgroundColor: "#fff",
                    }}
                    onChange={(e) => setCarreraFiltradaAdmin(e.target.value)}
                  >
                    <option value="TODAS">-- Todas --</option>
                    {carrerasDisponibles.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div
                style={{
                  background: "white",
                  border: "1px solid #cbd5e0",
                  padding: "8px",
                  maxHeight: "110px",
                  overflowY: "auto",
                  borderRadius: "6px",
                }}
              >
                {estudiantesDisponibles
                  .filter((est) => {
                    if (carreraFiltradaAdmin === "TODAS") return true;
                    return est.carrera === carreraFiltradaAdmin;
                  })
                  .map((est) => (
                    <div
                      key={est._id}
                      style={{
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "3px",
                      }}
                    >
                      <input
                        type="checkbox"
                        id={`check-${est._id}`}
                        checked={estudiantesSeleccionados.includes(est._id)}
                        onChange={() => manejarCheckboxEstudiante(est._id)}
                        style={{ marginRight: "6px" }}
                      />
                      <label htmlFor={`check-${est._id}`}>
                        <strong>{est.nombre}</strong> -{" "}
                        <span style={{ color: "#718096", fontSize: "11px" }}>
                          {est.carrera}
                        </span>
                      </label>
                    </div>
                  ))}

                {carreraFiltradaAdmin !== "TODAS" &&
                  estudiantesDisponibles.filter(
                    (est) => est.carrera === carreraFiltradaAdmin,
                  ).length === 0 && (
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#e53e3e",
                        margin: 0,
                        fontStyle: "italic",
                      }}
                    >
                      ⚠️ No hay alumnos registrados en esta carrera.
                    </p>
                  )}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="submit"
                style={{
                  ...buttonStyle,
                  backgroundColor: idAsignaturaEditando ? "#dd6b20" : "#d69e2e",
                }}
              >
                {idAsignaturaEditando
                  ? "💾 Guardar Cambios"
                  : "Crear Asignatura"}
              </button>

              {idAsignaturaEditando && (
                <button
                  type="button"
                  onClick={cancelarEdicion}
                  style={{
                    ...buttonStyle,
                    backgroundColor: "#718096",
                  }}
                >
                  Cancelar Edición
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Lista de Asignaturas Creadas */}
        <div>
          <h3>📋 Asignaturas Registradas</h3>
          <div
            style={{
              maxHeight: "520px",
              overflowY: "auto",
              display: "grid",
              gap: "10px",
            }}
          >
            {listaAsignaturas.map((asig) => (
              <div
                key={asig._id}
                style={{
                  border: "1px solid #e2e8f0",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  background: "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <strong style={{ fontSize: "13px", color: "#2d3748" }}>
                    {asig.nombreAsignatura}
                  </strong>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        background: "#edf2f7",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        color: "#718096",
                      }}
                    >
                      {asig.codigo}
                    </span>
                    <button
                      onClick={() => activarModoEdicion(asig)}
                      style={{
                        background: "#3182ce",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "3px 6px",
                        fontSize: "10px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                      title="Editar Asignatura"
                    >
                      ✏️ Editar
                    </button>
                    {/* 2. NUEVO BOTÓN DE ELIMINAR */}
                    <button
                      onClick={() => manejarEliminarAsignatura(asig._id)}
                      style={{
                        background: "#e53e3e",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "3px 6px",
                        fontSize: "10px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                      title="Eliminar Asignatura"
                    >
                      ✕ Eliminar
                    </button>
                  </div>
                </div>

                {/* Docente */}
                <div style={{ color: "#4a5568", marginBottom: "4px" }}>
                  👨‍🏫 <strong>Docente:</strong>{" "}
                  {asig.docente?.nombre || "No asignado"}
                </div>

                {/* Facultad y carrera */}
                {(asig.facultad || asig.carrera) && (
                  <div style={{ color: "#4a5568", marginBottom: "4px" }}>
                    🏫 {asig.facultad && <span>{asig.facultad}</span>}
                    {asig.facultad && asig.carrera && <span> · </span>}
                    {asig.carrera && (
                      <span style={{ color: "#718096" }}>{asig.carrera}</span>
                    )}
                  </div>
                )}

                {/* Alumnos */}
                <div style={{ color: "#4a5568", marginBottom: "4px" }}>
                  👥 <strong>Alumnos:</strong>{" "}
                  {asig.estudiantesInscritos?.length || 0} inscritos
                </div>

                {/* Periodo */}
                <div style={{ color: "#4a5568", marginBottom: "6px" }}>
                  📅 <strong>Período:</strong> {asig.periodo}
                </div>

                {/* Badges: Ayudantía y Examen Integral */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {asig.tieneAyudantia ? (
                    <span
                      style={{
                        fontSize: "10px",
                        padding: "2px 8px",
                        borderRadius: "20px",
                        background: "#ebf8ff",
                        color: "#2b6cb0",
                        border: "1px solid #bee3f8",
                        fontWeight: "bold",
                      }}
                    >
                      🤝 Con Ayudantía
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: "10px",
                        padding: "2px 8px",
                        borderRadius: "20px",
                        background: "#f7fafc",
                        color: "#a0aec0",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      Sin Ayudantía
                    </span>
                  )}

                  {asig.tieneExamenIntegral ? (
                    <span
                      style={{
                        fontSize: "10px",
                        padding: "2px 8px",
                        borderRadius: "20px",
                        background: "#fffaf0",
                        color: "#c05621",
                        border: "1px solid #fbd38d",
                        fontWeight: "bold",
                      }}
                    >
                      📝 Examen Integral ({asig.porcentajeExamenIntegral}%)
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: "10px",
                        padding: "2px 8px",
                        borderRadius: "20px",
                        background: "#f7fafc",
                        color: "#a0aec0",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      Sin Examen Integral
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
