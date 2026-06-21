// src/hooks/useAcademicApp.js
import { useState, useEffect } from "react";

export function useAcademicApp() {
  // ==========================================
  // 1. ESTADOS DE SESIÓN Y LOGIN
  // ==========================================
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [error, setError] = useState("");

  // ==========================================
  // 2. ESTADOS DE GESTIÓN DE USUARIOS (ADMIN)
  // ==========================================
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

  // ==========================================
  // 3. ESTADOS DE GESTIÓN DE ASIGNATURAS (ADMIN)
  // ==========================================
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

  // ==========================================
  // 4. ESTADOS EXCLUSIVOS DEL DOCENTE
  // ==========================================
  const [asignaturasDocente, setAsignaturasDocente] = useState([]);
  const [asignaturaActiva, setAsignaturaActiva] = useState(null);
  const [baseNotas, setBaseNotas] = useState([]);
  const [msgNotas, setMsgNotas] = useState("");

  // ==========================================
  // 5. ESTADOS EXCLUSIVOS DEL ESTUDIANTE
  // ==========================================
  const [asignaturasEstudiante, setAsignaturasEstudiante] = useState([]);

  // ==========================================
  // 6. SELECTORES DERIVADOS (FILTROS EN TIEMPO REAL)
  // ==========================================
  const docentesDisponibles = listaUsuarios.filter((u) => u.rol === "Docente");
  const estudiantesDisponibles = listaUsuarios.filter(
    (u) => u.rol === "Estudiante",
  );

  // ==========================================
  // 7. FUNCIONES DE BÚSQUEDA INTERNA (HELPERS)
  // ==========================================

  /**
   * Buscador de notas seguro para la planilla del Docente (Asegura la asignatura activa)
   */
  const buscarNotaEnBase = (estudianteId, nombreEval) => {
    return baseNotas.find(
      (n) =>
        (n.estudiante === estudianteId || n.estudiante?._id === estudianteId) &&
        (n.asignatura === asignaturaActiva?._id ||
          n.asignatura?._id === asignaturaActiva?._id) &&
        n.nombreEval === nombreEval,
    );
  };

  /**
   * Buscador seguro de notas por Alumno y Asignatura para el panel del Estudiante
   */
  const buscarNotaEstudianteAsignatura = (
    estudianteId,
    asignaturaId,
    nombreEval,
  ) => {
    return baseNotas.find(
      (n) =>
        (n.estudiante === estudianteId || n.estudiante?._id === estudianteId) &&
        (n.asignatura === asignaturaId || n.asignatura?._id === asignaturaId) &&
        n.nombreEval === nombreEval,
    );
  };

  // ==========================================
  // 8. PETICIONES AL SERVIDOR (API FETCH)
  // ==========================================
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

  const consultarAsignaturasDocente = async (docenteId) => {
    try {
      const url = `http://localhost:5000/api/asignatura/docente/${docenteId}`;
      const resp = await fetch(url);
      const data = await resp.json();
      if (data.success) setAsignaturasDocente(data.asignaturas);
    } catch (err) {
      console.error("Error al traer ramos del docente", err);
    }
  };

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

  const consultarAsignaturasEstudiante = async (estudianteId) => {
    try {
      const url = `http://localhost:5000/api/asignatura/estudiante/${estudianteId}`;
      const resp = await fetch(url);
      const data = await resp.json();

      if (data.success) {
        setAsignaturasEstudiante(data.asignaturas);
        // Descargar el historial de notas de cada asignatura inscrita
        for (const asig of data.dashboards || data.asignaturas) {
          await consultarNotasParaEstudiante(asig._id);
        }
      }
    } catch (err) {
      console.error("Error al traer ramos del estudiante:", err);
    }
  };

  const consultarNotasParaEstudiante = async (asignaturaId) => {
    try {
      const resp = await fetch(
        `http://localhost:5000/api/grades/asignatura/${asignaturaId}`,
      );
      const data = await resp.json();
      if (data.success) {
        setBaseNotas((prev) => {
          // Evitamos duplicados limpiando las notas antiguas de esta asignatura específica
          const filtradas = prev.filter(
            (n) =>
              n.asignatura !== asignaturaId &&
              n.asignatura?._id !== asignaturaId,
          );
          return [...filtradas, ...data.notas];
        });
      }
    } catch (err) {
      console.error("Error al traer notas de asignatura para estudiante", err);
    }
  };

  // ==========================================
  // 9. LIFECYCLE EFFECTS (EFECTOS DE REACCIÓN)
  // ==========================================
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
        if (docenteId) consultarAsignaturasDocente(docenteId);
      } else if (
        usuarioLogueado.rol === "Estudiante" ||
        usuarioLogueado.user?.rol === "Estudiante"
      ) {
        const estudianteId = usuarioLogueado.user?._id || usuarioLogueado._id;
        if (estudianteId) consultarAsignaturasEstudiante(estudianteId);
      }
    }
  }, [usuarioLogueado]);

  useEffect(() => {
    if (asignaturaActiva) {
      consultarNotasAsignatura(asignaturaActiva._id);
    }
  }, [asignaturaActiva]);

  // ==========================================
  // 10. MANEJADORES DE EVENTOS DE LA INTERFAZ
  // ==========================================
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
        setNombreAsignatura("");
        setCodigoAsignatura("");
        setEstudiantesSeleccionados([]);
      } else {
        setMsgAsignatura(`❌ ${data.msg || "Error al crear asignatura"}`);
      }
    } catch (err) {
      setMsgAsignatura(
        "❌ Error de red: Asegúrate de que las evaluaciones tengan nombre y que el backend esté corriendo.",
      );
    }
  };

  const guardarNotaServidor = async (estudianteId, nombreEval, valorNota) => {
    setMsgNotas("");
    const notaNum = parseFloat(valorNota);

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
    return (sumaPuntos / sumaPonderacionesConNota).toFixed(2);
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    setUsuarioLogueado(null);
    setListaUsuarios([]);
    setListaAsignaturas([]);
    setAsignaturasDocente([]);
    setAsignaturaActiva(null);
  };

  // ==========================================
  // 11. ALGORITMO PREDICTIVO ACADÉMICO (ESTUDIANTE)
  // ==========================================
  const calcularEstadoEstudiante = (asignatura) => {
    const estudianteId = usuarioLogueado?.user?._id || usuarioLogueado?._id;

    let sumaPuntosAcumulados = 0;
    let ponderacionEvaluada = 0;
    let notasDetalle = [];

    // Recorrer la configuración de evaluaciones fijadas por el Administrador
    asignatura.evaluaciones?.forEach((ev) => {
      const registroNota = buscarNotaEstudianteAsignatura(
        estudianteId,
        asignatura._id,
        ev.nombreEval,
      );
      const tieneNota =
        registroNota &&
        registroNota.calificacion !== undefined &&
        registroNota.calificacion !== null;

      if (tieneNota) {
        sumaPuntosAcumulados += registroNota.calificacion * ev.ponderacion;
        ponderacionEvaluada += ev.ponderacion;
      }

      notasDetalle.push({
        nombreEval: ev.nombreEval,
        ponderacion: ev.ponderacion,
        nota: tieneNota ? registroNota.calificacion : null,
        modificadoPor:
          registroNota?.modificadoPor?.nombre ||
          registroNota?.modificadoPor ||
          null,
      });
    });

    // Cálculos estadísticos básicos
    const promedioAcumulado =
      ponderacionEvaluada > 0
        ? parseFloat((sumaPuntosAcumulados / ponderacionEvaluada).toFixed(2))
        : 0;
    const ponderacionRestante = 100 - ponderacionEvaluada;

    // Ecuación Predictiva Chilena (Aprobación con 4.0)
    const NOTA_MINIMA_APROBAR = 4.0;
    let notaNecesaria = 0;
    let riesgoInminente = false;
    let reprobadoMatematicamente = false;

    if (ponderacionRestante > 0) {
      // Fórmula matemática: (400 - Puntos_Acumulados) / Ponderacion_Restante
      const calculo = (400 - sumaPuntosAcumulados) / ponderacionRestante;
      notaNecesaria = parseFloat(calculo.toFixed(2));

      if (notaNecesaria > 7.0) {
        reprobadoMatematicamente = true; // Ni con un 7.0 en todo lo restante alcanza
      } else if (notaNecesaria > 4.5) {
        riesgoInminente = true; // Requiere alta exigencia para salvar la materia
      }
    } else {
      if (promedioAcumulado < NOTA_MINIMA_APROBAR) {
        reprobadoMatematicamente = true;
      }
    }

    return {
      notasDetalle,
      promedioAcumulado:
        ponderacionEvaluada > 0 ? promedioAcumulado.toFixed(1) : "-.-",
      ponderacionRestante,
      notaNecesariaParaAprobar:
        notaNecesaria > 1.0 ? notaNecesaria.toFixed(1) : "1.0",
      riesgoInminente,
      reprobadoMatematicamente,
      periodoTerminado: ponderacionRestante === 0,
      aprobado:
        ponderacionRestante === 0 && promedioAcumulado >= NOTA_MINIMA_APROBAR,
    };
  };

  // ==========================================
  // 12. RETORNO DE CONTEXTO DE LA APLICACIÓN
  // ==========================================
  return {
    // Estados login
    correo,
    setCorreo,
    password,
    setPassword,
    usuarioLogueado,
    error,
    // Estados usuarios
    listaUsuarios,
    msgRegistro,
    nuevoUsuario,
    setNuevoUsuario,
    carrerasDisponibles,
    // Estados asignaturas
    nombreAsignatura,
    setNombreAsignatura,
    codigoAsignatura,
    setCodigoAsignatura,
    periodo,
    setPeriodo,
    docenteSeleccionado,
    setDocenteSeleccionado,
    estudiantesSeleccionados,
    evaluaciones,
    msgAsignatura,
    listaAsignaturas,
    carreraFiltradaAdmin,
    setCarreraFiltradaAdmin,
    // Estados docente / alumno
    asignaturasDocente,
    asignaturaActiva,
    setAsignaturaActiva,
    msgNotas,
    asignaturasEstudiante,
    calcularEstadoEstudiante,
    baseNotas,
    // Selectores filtrados
    docentesDisponibles,
    estudiantesDisponibles,
    // Handlers & Funciones
    manejarLogin,
    manejarRegistroUsuario,
    agregarFilaEvaluacion,
    eliminarFilaEvaluacion,
    actualizarFilaEvaluacion,
    manejarCheckboxEstudiante,
    manejarCrearAsignatura,
    buscarNotaEnBase,
    guardarNotaServidor,
    calcularPromedioPonderado,
    cerrarSesion,
  };
}
