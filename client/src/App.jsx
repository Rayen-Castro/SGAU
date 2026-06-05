import React, { useState, useEffect } from "react";

function App() {
  // --- ESTADOS DE SESIÓN Y LOGIN ---
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [error, setError] = useState("");

  // --- ESTADOS DE GESTIÓN DE USUARIOS (PARTE 1) ---
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [msgRegistro, setMsgRegistro] = useState("");
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    correo: "",
    password: "",
    rol: "Estudiante",
    carrera: "Ingeniería Civil Informática",
  });
  const carrerasDisponibles = [
    "Ingeniería Civil Informática",
    "Ingeniería Civil Ambiental",
    "Agronomía",
    "Psicología",
    "Medicina Veterinaria",
  ];

  // --- ESTADOS DE GESTIÓN DE ASIGNATURAS (PARTE 2) ---
  const [nombreAsignatura, setNombreAsignatura] = useState("");
  const [codigoAsignatura, setCodigoAsignatura] = useState("");
  const [periodo, setPeriodo] = useState("2026-1");
  const [docenteSeleccionado, setDocenteSeleccionado] = useState("");
  const [estudiantesSeleccionados, setEstudiantesSeleccionados] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([
    { nombreEval: "Certamen 1", ponderacion: 50 },
    { nombreEval: "Certamen 2", ponderacion: 50 },
  ]);
  const [msgAsignatura, setMsgAsignatura] = useState("");
  const [listaAsignaturas, setListaAsignaturas] = useState([]);
  const [carreraFiltradaAdmin, setCarreraFiltradaAdmin] = useState("TODAS");

  // --- ESTADOS EXCLUSIVOS DEL DOCENTE (PARTE 3) ---
  const [asignaturasDocente, setAsignaturasDocente] = useState([]);
  const [asignaturaActiva, setAsignaturaActiva] = useState(null);
  const [baseNotas, setBaseNotas] = useState([]); // Matriz global de notas traídas del servidor
  const [msgNotas, setMsgNotas] = useState("");

  // --- ESTADOS ESTUDIANTE (PARTE 4) ---
  const [asignaturasEstudiante, setAsignaturasEstudiante] = useState([]);

  // --- FUNCIONES API ---
  const consultarUsuarios = async () => {
    try {
      const resp = await fetch("http://localhost:5000/api/auth/usuarios");
      const data = await resp.json();
      if (data.success) setListaUsuarios(data.usuarios);
    } catch (err) {
      console.error("Error al traer usuarios", err);
    }
  };

  const consultarAsignaturas = async () => {
    try {
      const resp = await fetch("http://localhost:5000/api/asignatura");
      const data = await resp.json();
      if (data.success) setListaAsignaturas(data.asignaturas);
    } catch (err) {
      console.error("Error al traer asignaturas", err);
    }
  };

  // Traer ramos específicos del docente logueado
  const consultarAsignaturasDocente = async (docenteId) => {
    console.log("3. Ejecutando fetch para el docente con ID real:", docenteId);
    try {
      const url = `http://localhost:5000/api/asignatura/docente/${docenteId}`;
      const resp = await fetch(url);
      const data = await resp.json();
      console.log("4. Respuesta del backend a las asignaturas:", data);

      if (data.success) {
        setAsignaturasDocente(data.asignaturas);
      }
    } catch (err) {
      console.error("Error al traer ramos del docente", err);
    }
  };

  // Traer bitácora de notas de la asignatura activa para cruzar datos
  const consultarNotasAsignatura = async (asignaturaId) => {
    try {
      const resp = await fetch(
        `http://localhost:5000/api/grades/asignatura/${asignaturaId}`,
      );
      const data = await resp.json();
      if (data.success) setBaseNotas(data.notas);
    } catch (err) {
      console.error("Error al traer notas", err);
    }
  };

  useEffect(() => {
    if (usuarioLogueado) {
      if (usuarioLogueado.rol === "Admin") {
        consultarUsuarios();
        consultarAsignaturas();
      } else if (
        usuarioLogueado.rol === "Docente" ||
        usuarioLogueado.user?.rol === "Docente"
      ) {
        const docenteId = usuarioLogueado.user?._id || usuarioLogueado._id;
        if (docenteId) {
          consultarAsignaturasDocente(docenteId);
        } else {
          console.error(
            "No se pudo encontrar el ID del docente en el objeto de sesión",
          );
        }
      } else if (
        usuarioLogueado.rol === "Estudiante" ||
        usuarioLogueado.user?.rol === "Estudiante"
      ) {
        const estudianteId = usuarioLogueado.user?._id || usuarioLogueado._id;
        if (estudianteId) {
          consultarAsignaturasEstudiante(estudianteId);
        } else {
          console.error(
            "No se pudo encontrar el ID del estudiante en el objeto de sesión",
          );
        }
      }
    }
  }, [usuarioLogueado]);

  // Ejecutar recarga de notas cuando el docente cambia de ramo activo
  useEffect(() => {
    if (asignaturaActiva) {
      consultarNotasAsignatura(asignaturaActiva._id);
    }
  }, [asignaturaActiva]);

  const manejarLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const resp = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password }),
      });
      const data = await resp.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        setUsuarioLogueado(data.user);
        console.log(
          "1. Lo que recibe el Login desde el servidor:",
          respuesta.data,
        );
      } else {
        setError(data.msg || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor backend.");
    }
  };

  const manejarRegistroUsuario = async (e) => {
    e.preventDefault();
    setMsgRegistro("");
    try {
      const resp = await fetch("http://localhost:5000/api/auth/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });
      const data = await resp.json();
      if (data.success) {
        setMsgRegistro(`${data.msg}`);
        consultarUsuarios();
        setNuevoUsuario({
          nombre: "",
          correo: "",
          password: "",
          rol: "Estudiante",
          carrera: "Ingeniería Civil Informática",
        });
      } else {
        setMsgRegistro(`${data.msg}`);
      }
    } catch (err) {
      setMsgRegistro("Error al registrar usuario.");
    }
  };

  // --- LÓGICA DE ASIGNATURAS ADMIN ---
  const agregarFilaEvaluacion = () =>
    setEvaluaciones([...evaluaciones, { nombreEval: "", ponderacion: 0 }]);
  const eliminarFilaEvaluacion = (index) =>
    setEvaluaciones(evaluaciones.filter((_, i) => i !== index));
  const actualizarFilaEvaluacion = (index, campo, valor) => {
    const nuevasEval = [...evaluaciones];
    nuevasEval[index][campo] = valor;
    setEvaluaciones(nuevasEval);
  };
  const manejarCheckboxEstudiante = (id) => {
    if (estudiantesSeleccionados.includes(id)) {
      setEstudiantesSeleccionados(
        estudiantesSeleccionados.filter((eId) => eId !== id),
      );
    } else {
      setEstudiantesSeleccionados([...estudiantesSeleccionados, id]);
    }
  };

  const manejarCrearAsignatura = async (e) => {
    e.preventDefault();
    setMsgAsignatura("");

    if (!docenteSeleccionado || estudiantesSeleccionados.length === 0) {
      setMsgAsignatura("❌ Falta asignar docente o estudiantes.");
      return;
    }

    // regla de negocio: la suma de las ponderaciones debe ser exactamente 100%
    const sumaPonderaciones = evaluaciones.reduce(
      (total, ev) => total + (parseInt(ev.ponderacion) || 0),
      0,
    );
    if (sumaPonderaciones !== 100) {
      setMsgAsignatura(
        `Error: La suma de las ponderaciones es ${sumaPonderaciones}%. Debe ser exactamente 100% para poder registrar la asignatura.`,
      );
      return;
    }

    try {
      const resp = await fetch("http://localhost:5000/api/asignatura/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreAsignatura,
          codigo: codigoAsignatura,
          periodo,
          docenteId: docenteSeleccionado,
          estudiantesIds: estudiantesSeleccionados,
          evaluaciones,
        }),
      });

      const data = await resp.json();
      if (data.success) {
        setMsgAsignatura(`✅ ${data.msg}`);
        consultarAsignaturas();
        // Limpiamos el formulario tras el éxito
        setNombreAsignatura("");
        setCodigoAsignatura("");
        setEstudiantesSeleccionados([]);
      } else {
        setMsgAsignatura(
          `❌ ${data.msg || "Error al crear asignatura en el servidor"}`,
        );
      }
    } catch (err) {
      setMsgAsignatura(
        "❌ Error de red: Asegúrate de que las evaluaciones tengan nombre y que el backend esté corriendo.",
      );
    }
  };

  // --- LÓGICA DE CALIFICACIONES DOCENTE (HITO 3) ---

  const buscarNotaEnBase = (estudianteId, nombreEval) => {
    return baseNotas.find(
      (n) => n.estudiante === estudianteId && n.nombreEval === nombreEval,
    );
  };

  // Guardar nota individual en Atlas
  const guardarNotaServidor = async (estudianteId, nombreEval, valorNota) => {
    setMsgNotas("");
    const notaNum = parseFloat(valorNota);

    // Validación visual de rango
    if (!valorNota) return;
    if (notaNum < 1.0 || notaNum > 7.0) {
      setMsgNotas(
        "Error: Las calificaciones deben estar estrictamente entre 1.0 y 7.0",
      );
      return;
    }

    try {
      const resp = await fetch("http://localhost:5000/api/grades/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estudianteId,
          asignaturaId: asignaturaActiva._id,
          nombreEval,
          calificacion: notaNum,
          profesorId: usuarioLogueado._id || usuarioLogueado.id,
          modificadoPor: usuarioLogueado.nombre,
        }),
      });

      const data = await resp.json();

      if (data.success) {
        consultarNotasAsignatura(asignaturaActiva._id);

        setMsgNotas("Nota guardada con éxito");
        setTimeout(() => setMsgNotas(""), 3000);
      }
    } catch (err) {
      setMsgNotas("❌ Error de red al procesar calificación.");
    }
  };

  // Calcular el promedio acumulado real de un estudiante considerando solo las notas ingresadas
  const calcularPromedioPonderado = (estudianteId) => {
    let sumaPuntos = 0;
    let sumaPonderacionesConNota = 0;

    asignaturaActiva.evaluaciones.forEach((ev) => {
      const registro = buscarNotaEnBase(estudianteId, ev.nombreEval);
      if (registro) {
        sumaPuntos += registro.calificacion * ev.ponderacion;
        sumaPonderacionesConNota += ev.ponderacion;
      }
    });

    if (sumaPonderacionesConNota === 0) return "-";
    // Dividimos por la ponderación acumulada parcial para simular la nota real del momento
    const promedio = sumaPuntos / sumaPonderacionesConNota;
    return promedio.toFixed(2);
  };

  // --- LÓGICA ESTUDIANTE (HITO 4) ---

  const consultarAsignaturasEstudiante = async (estudianteId) => {
    try {
      const url = `http://localhost:5000/api/asignatura/estudiante/${estudianteId}`;
      const resp = await fetch(url);
      const data = await resp.json();

      if (data.success) {
        setAsignaturasEstudiante(data.asignaturas);
      }
    } catch (err) {
      console.error("Error al traer ramos del estudiante:", err);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    setUsuarioLogueado(null);
    setListaUsuarios([]);
    setListaAsignaturas([]);
    setAsignaturasDocente([]);
    setAsignaturaActiva(null);
  };

  const docentesDisponibles = listaUsuarios.filter((u) => u.rol === "Docente");
  const estudiantesDisponibles = listaUsuarios.filter(
    (u) => u.rol === "Estudiante",
  );

  return (
    <div
      style={{
        fontFamily: "Segoe UI, sans-serif",
        padding: "20px",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ color: "#004a99", margin: 0 }}>
          Sistema de Gestión Académica
        </h1>
        <p style={{ color: "#555", margin: "5px 0 0 0" }}>
          Gestión Académica & Rendimiento Predictivo
        </p>
      </header>

      {!usuarioLogueado ? (
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            maxWidth: "400px",
            margin: "auto",
          }}
        >
          <h2 style={{ textAlign: "center", color: "#333", marginTop: 0 }}>
            Iniciar Sesión
          </h2>
          {error && (
            <p
              style={{
                color: "white",
                backgroundColor: "#e53e3e",
                padding: "10px",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            >
              {error}
            </p>
          )}
          <form onSubmit={manejarLogin}>
            <input
              type="email"
              placeholder="Correo"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              Ingresar al Sistema
            </button>
          </form>
        </div>
      ) : (
        <div
          style={{
            maxWidth: "1200px",
            margin: "auto",
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "2px solid #eee",
              paddingBottom: "15px",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2 style={{ margin: 0, color: "#2d3748" }}>
                Bienvenido, {usuarioLogueado.nombre}
              </h2>
              <span
                style={{
                  backgroundColor: "#004a99",
                  color: "white",
                  padding: "3px 10px",
                  borderRadius: "15px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                Rol: {usuarioLogueado.rol}
              </span>
            </div>
            <button
              onClick={cerrarSesion}
              style={{
                color: "#e53e3e",
                cursor: "pointer",
                border: "1px solid #e53e3e",
                background: "none",
                padding: "8px 15px",
                borderRadius: "5px",
                fontWeight: "bold",
              }}
            >
              Cerrar Sesión
            </button>
          </div>

          {/* ========================================================= */}
          {/* PANAL DEL ADMINISTRADOR (HITOS 1 Y 2)                     */}
          {/* ========================================================= */}
          {usuarioLogueado.rol === "Admin" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "40px",
              }}
            >
              {/* Bloques de gestión usuarios y asignaturas (Igual que antes) */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  borderBottom: "2px dashed #e2e8f0",
                  paddingBottom: "30px",
                }}
              >
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
                      gap: "8px",
                      background: "#f7fafc",
                      padding: "15px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      required
                      value={nuevoUsuario.nombre}
                      onChange={(e) =>
                        setNuevoUsuario({
                          ...nuevoUsuario,
                          nombre: e.target.value,
                        })
                      }
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      placeholder="Correo electrónico"
                      required
                      value={nuevoUsuario.correo}
                      onChange={(e) =>
                        setNuevoUsuario({
                          ...nuevoUsuario,
                          correo: e.target.value,
                        })
                      }
                      style={inputStyle}
                    />
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#718096",
                        margin: "-5px 0 5px 0",
                      }}
                    >
                      💡 Dominio automático:{" "}
                      <strong>
                        {nuevoUsuario.rol === "Estudiante"
                          ? "@alu.uct.cl"
                          : "@uct.cl"}
                      </strong>
                    </p>
                    <input
                      type="password"
                      placeholder="Contraseña inicial"
                      required
                      value={nuevoUsuario.password}
                      onChange={(e) =>
                        setNuevoUsuario({
                          ...nuevoUsuario,
                          password: e.target.value,
                        })
                      }
                      style={inputStyle}
                    />
                    <select
                      value={nuevoUsuario.rol}
                      onChange={(e) =>
                        setNuevoUsuario({
                          ...nuevoUsuario,
                          rol: e.target.value,
                          carrera:
                            e.target.value === "Docente"
                              ? ""
                              : carrerasDisponibles[0],
                        })
                      }
                      style={inputStyle}
                    >
                      <option value="Estudiante">Estudiante</option>
                      <option value="Docente">Docente</option>
                    </select>
                    {nuevoUsuario.rol === "Estudiante" && (
                      <select
                        value={nuevoUsuario.carrera}
                        onChange={(e) =>
                          setNuevoUsuario({
                            ...nuevoUsuario,
                            carrera: e.target.value,
                          })
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
                      style={{ ...buttonStyle, backgroundColor: "#2b6cb0" }}
                    >
                      Guardar Usuario
                    </button>
                  </form>
                </div>
                <div>
                  <h3>👥 Usuarios en Base de Datos</h3>
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
                          <th style={{ padding: "8px", textAlign: "left" }}>
                            Nombre
                          </th>
                          <th style={{ padding: "8px", textAlign: "left" }}>
                            Rol
                          </th>
                          <th style={{ padding: "8px", textAlign: "left" }}>
                            Carrera
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {listaUsuarios.map((u) => (
                          <tr
                            key={u._id}
                            style={{ borderBottom: "1px solid #e2e8f0" }}
                          >
                            <td style={{ padding: "8px" }}>
                              <strong>{u.nombre}</strong>
                              <br />
                              <span
                                style={{ color: "#718096", fontSize: "11px" }}
                              >
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
                            <td style={{ padding: "8px" }}>
                              {u.carrera || "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Formulario de Asignaturas */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 0.8fr",
                  gap: "30px",
                }}
              >
                <div>
                  <h3>📘 Configurar Nueva Asignatura (Hito 2)</h3>
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
                    onSubmit={manejarCrearAsignatura}
                    style={{
                      background: "#f7fafc",
                      padding: "20px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e0",
                      display: "grid",
                      gap: "12px",
                    }}
                  >
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
                          style={{
                            display: "flex",
                            gap: "5px",
                            marginTop: "5px",
                          }}
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

                    {/* SECCIÓN DE SELECCIÓN DE ALUMNOS CON FILTRO POR CARRERA (CORREGIDO) */}
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
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
                          🎓 Inscribir Alumnos:
                        </label>

                        {/* FILTRO INTERACTIVO CON ESTADO REAL DE REACT */}
                        <div style={{ fontSize: "11px" }}>
                          <span
                            style={{ color: "#718096", marginRight: "5px" }}
                          >
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
                            onChange={(e) =>
                              setCarreraFiltradaAdmin(e.target.value)
                            }
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
                            // Si el estado es "TODAS", pasan todos los alumnos
                            if (carreraFiltradaAdmin === "TODAS") return true;
                            // Si no, filtramos estrictamente por la carrera seleccionada
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
                                checked={estudiantesSeleccionados.includes(
                                  est._id,
                                )}
                                onChange={() =>
                                  manejarCheckboxEstudiante(est._id)
                                }
                                style={{ marginRight: "6px" }}
                              />
                              <label htmlFor={`check-${est._id}`}>
                                <strong>{est.nombre}</strong> -{" "}
                                <span
                                  style={{ color: "#718096", fontSize: "11px" }}
                                >
                                  {est.carrera}
                                </span>
                              </label>
                            </div>
                          ))}

                        {/* Mensaje de alerta en caso de que la carrera no tenga alumnos inscritos en el sistema */}
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
                    <button
                      type="submit"
                      style={{ ...buttonStyle, backgroundColor: "#d69e2e" }}
                    >
                      Crear Asignatura
                    </button>
                  </form>
                </div>
                <div>
                  <h3>📋 Asignaturas Registradas</h3>
                  {listaAsignaturas.map((asig) => (
                    <div
                      key={asig._id}
                      style={{
                        border: "1px solid #cbd5e0",
                        padding: "10px",
                        borderRadius: "6px",
                        marginBottom: "8px",
                        fontSize: "12px",
                      }}
                    >
                      <strong>{asig.nombreAsignatura}</strong> ({asig.codigo})
                      <br />
                      Profesor: {asig.docente?.nombre}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 🔥 NUEVO PANEL DEL DOCENTE (HITO 3)                       */}
          {/* ========================================================= */}
          {usuarioLogueado.rol === "Docente" && (
            <div>
              <h3>👨‍🏫 Módulo de Calificaciones Docente</h3>
              <p style={{ color: "#4a5568", marginTop: "-10px" }}>
                Seleccione una de sus asignaturas titulares para abrir la
                planilla de notas del semestre.
              </p>

              {/* Grid Principal del Profesor */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "300px 1fr",
                  gap: "20px",
                  marginTop: "20px",
                }}
              >
                {/* Columna Izquierda: Lista de sus ramos */}
                <div
                  style={{
                    background: "#f7fafc",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <h4
                    style={{
                      margin: "0 0 10px 0",
                      borderBottom: "1px solid #cbd5e0",
                      paddingBottom: "5px",
                    }}
                  >
                    Mis Asignaturas
                  </h4>
                  {asignaturasDocente.length === 0 ? (
                    <p style={{ fontSize: "13px", color: "#718096" }}>
                      No tienes ramos asignados este periodo.
                    </p>
                  ) : (
                    asignaturasDocente.map((ramo) => (
                      <div
                        key={ramo._id}
                        onClick={() => setAsignaturaActiva(ramo)}
                        style={{
                          padding: "12px",
                          borderRadius: "6px",
                          marginBottom: "8px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          backgroundColor:
                            asignaturaActiva?._id === ramo._id
                              ? "#ebf8ff"
                              : "white",
                          border:
                            asignaturaActiva?._id === ramo._id
                              ? "2px solid #3182ce"
                              : "1px solid #cbd5e0",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        }}
                      >
                        <strong style={{ color: "#2b6cb0", fontSize: "14px" }}>
                          {ramo.nombreAsignatura}
                        </strong>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#718096",
                            marginTop: "3px",
                          }}
                        >
                          Código: {ramo.codigo} | 👥{" "}
                          {ramo.estudiantesInscritos?.length || 0} Alumnos
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Columna Derecha: Planilla de Notas Interactiva */}
                <div
                  style={{
                    background: "white",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  {!asignaturaActiva ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "5px",
                        color: "#718096",
                        marginTop: "40px",
                      }}
                    >
                      <span style={{ fontSize: "40px" }}>📊</span>
                      <h4>No hay ninguna asignatura seleccionada</h4>
                      <p style={{ fontSize: "13px" }}>
                        Haz clic en una materia de la lista izquierda para
                        cargar la planilla de calificaciones.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          borderBottom: "2px solid #3182ce",
                          paddingBottom: "8px",
                          marginBottom: "15px",
                        }}
                      >
                        <h3 style={{ margin: 0, color: "#2c5282" }}>
                          Planilla: {asignaturaActiva.nombreAsignatura}
                        </h3>
                        <span
                          style={{
                            fontSize: "12px",
                            background: "#e2e8f0",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            fontWeight: "bold",
                          }}
                        >
                          Periodo: {asignaturaActiva.periodo}
                        </span>
                      </div>

                      {msgNotas && (
                        <p
                          style={{
                            padding: "10px",
                            backgroundColor: "#fff5f5",
                            borderLeft: "4px solid #e53e3e",
                            color: "#c53030",
                            borderRadius: "4px",
                            fontSize: "13px",
                            fontWeight: "bold",
                          }}
                        >
                          {msgNotas}
                        </p>
                      )}

                      {/* Tabla de Notas Completa */}
                      <div style={{ overflowX: "auto" }}>
                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontSize: "13px",
                          }}
                        >
                          <thead>
                            <tr
                              style={{
                                backgroundColor: "#ebf8ff",
                                borderBottom: "2px solid #bee3f8",
                              }}
                            >
                              <th
                                style={{
                                  padding: "12px",
                                  textAlign: "left",
                                  minWidth: "180px",
                                }}
                              >
                                Estudiante / Carrera
                              </th>
                              {/* Renderizar dinámicamente las columnas de evaluaciones configuradas */}
                              {asignaturaActiva.evaluaciones?.map((ev, i) => (
                                <th
                                  key={i}
                                  style={{
                                    padding: "12px",
                                    textAlign: "center",
                                    minWidth: "110px",
                                  }}
                                >
                                  <div style={{ fontWeight: "bold" }}>
                                    {ev.nombreEval}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "11px",
                                      color: "#4a5568",
                                      fontWeight: "normal",
                                    }}
                                  >
                                    Pond: {ev.ponderacion}%
                                  </div>
                                </th>
                              ))}
                              <th
                                style={{
                                  padding: "12px",
                                  textAlign: "center",
                                  backgroundColor: "#edf2f7",
                                  fontWeight: "bold",
                                  width: "90px",
                                }}
                              >
                                Promedio
                                <br />
                                Parcial
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {asignaturaActiva.estudiantesInscritos?.length ===
                            0 ? (
                              <tr>
                                <td
                                  colSpan={
                                    asignaturaActiva.evaluaciones.length + 2
                                  }
                                  style={{
                                    padding: "20px",
                                    textAlign: "center",
                                    color: "#718096",
                                  }}
                                >
                                  No hay estudiantes inscritos en este ramo.
                                </td>
                              </tr>
                            ) : (
                              asignaturaActiva.estudiantesInscritos.map(
                                (alumno) => (
                                  <tr
                                    key={alumno._id}
                                    style={{
                                      borderBottom: "1px solid #e2e8f0",
                                      transition: "background 0.2s",
                                    }}
                                  >
                                    {/* Datos del Alumno */}
                                    <td style={{ padding: "10px" }}>
                                      <div
                                        style={{
                                          fontWeight: "bold",
                                          color: "#2d3748",
                                        }}
                                      >
                                        {alumno.nombre}
                                      </div>
                                      <div
                                        style={{
                                          fontSize: "11px",
                                          color: "#718096",
                                        }}
                                      >
                                        {alumno.carrera}
                                      </div>
                                    </td>

                                    {/* Inputs de Notas Dinámicos */}
                                    {asignaturaActiva.evaluaciones.map(
                                      (ev, idx) => {
                                        const registroNota = buscarNotaEnBase(
                                          alumno._id,
                                          ev.nombreEval,
                                        );

                                        return (
                                          <td
                                            key={idx}
                                            style={{
                                              padding: "10px",
                                              textAlign: "center",
                                              verticalAlign: "middle",
                                            }}
                                          >
                                            <div
                                              style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                              }}
                                            >
                                              {/* INPUT DE LA NOTA CORREGIDO */}
                                              <input
                                                type="number"
                                                step="0.1"
                                                min="1.0"
                                                max="7.0"
                                                placeholder="-.-"
                                                defaultValue={
                                                  registroNota
                                                    ? registroNota.calificacion
                                                    : ""
                                                }
                                                onBlur={(e) =>
                                                  guardarNotaServidor(
                                                    alumno._id,
                                                    ev.nombreEval,
                                                    e.target.value,
                                                  )
                                                }
                                                style={{
                                                  width: "60px",
                                                  padding: "6px",
                                                  textAlign: "center",
                                                  borderRadius: "4px",
                                                  border: "1px solid #cbd5e0",
                                                  fontWeight: "bold",
                                                  color: "#2d3748",
                                                  backgroundColor: registroNota
                                                    ? "#edf2f7"
                                                    : "#ffffff",
                                                }}
                                              />

                                              {/* AUDITORÍA CORREGIDA Y ASEGURADA */}
                                              {registroNota && (
                                                <small
                                                  style={{
                                                    display: "block",
                                                    fontSize: "9px",
                                                    color: "#4a5568",
                                                    marginTop: "6px",
                                                    lineHeight: "1.2",
                                                    maxWidth: "90px",
                                                    textAlign: "center",
                                                  }}
                                                >
                                                  📝 Por:{" "}
                                                  {registroNota.modificadoPor
                                                    ?.nombre || "Docente"}
                                                </small>
                                              )}
                                            </div>
                                          </td>
                                        );
                                      },
                                    )}

                                    {/* Celda del Promedio Automático Recalculado */}
                                    <td
                                      style={{
                                        padding: "10px",
                                        textAlign: "center",
                                        backgroundColor: "#f7fafc",
                                        fontWeight: "bold",
                                        fontSize: "14px",
                                        color: "#2b6cb0",
                                      }}
                                    >
                                      {calcularPromedioPonderado(alumno._id)}
                                    </td>
                                  </tr>
                                ),
                              )
                            )}
                          </tbody>
                        </table>
                      </div>

                      <div
                        style={{
                          marginTop: "15px",
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                          background: "#ebf8ff",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #bee3f8",
                        }}
                      >
                        <span style={{ fontSize: "16px" }}>💡</span>
                        <span style={{ fontSize: "12px", color: "#2c5282" }}>
                          <strong>Tips de Uso:</strong> Cambia cualquier nota y
                          haz clic fuera del cuadro (o presiona Tabulador) para
                          guardarla. El promedio se recalcula al instante y la
                          marca temporal de auditoría se actualiza de inmediato.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VISTAS EXCLUSIVAS DEL ESTUDIANTE (HITO 4) */}
          {usuarioLogueado.rol === "Estudiante" && (
            <div style={{ marginTop: "20px" }}>
              <h3>🎓 Panel del Estudiante</h3>
              <p>
                Próximo paso Hito 4: Alertas de reprobación y cálculo
                predictivo.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

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

export default App;
