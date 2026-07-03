// src/App.jsx
import React, { useEffect } from "react";
import { useAcademicApp } from "./hooks/useAcademicApp";
import { Login } from "./components/Login";
import { AdminPanel } from "./components/AdminPanel";
import { TeacherPanel } from "./components/TeacherPanel";
import { StudentPanel } from "./components/StudentPanel";

function App() {
  const app = useAcademicApp();

  // Forzar que el cuerpo de la página del navegador siempre sea claro
  useEffect(() => {
    document.body.style.backgroundColor = "#f0f2f5";
    document.body.style.margin = "0";
  }, []);

  // 1. Si el usuario no está logueado, se muestra la pantalla de Login
  if (!app.usuarioLogueado) {
    return (
      <div
        style={{
          padding: "20px",
          fontFamily: "sans-serif",
          backgroundColor: "#f0f2f5",
          minHeight: "100vh",
        }}
      >
        <Login
          correo={app.correo}
          setCorreo={app.setCorreo}
          password={app.password}
          setPassword={app.setPassword}
          error={app.error}
          manejarLogin={app.manejarLogin}
        />
      </div>
    );
  }

  // 2. Si ya está logueado, se despliega la interfaz correspondiente a su rol
  return (
    <div
      style={{ padding: "25px", fontFamily: "sans-serif", color: "#2d3748" }}
    >
      {/* Encabezado General */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f0f2f5",
          borderBottom: "3px solid #004a99",
          paddingBottom: "15px",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: "#004a99" }}>
            🏫 Sistema Académico Integrado
          </h2>
          <span style={{ fontSize: "13px", color: "#718096" }}>
            Sesión activa: <strong>{app.usuarioLogueado.nombre}</strong> (
            {app.usuarioLogueado.rol})
          </span>
        </div>
        <button
          onClick={app.cerrarSesion}
          style={{
            padding: "8px 16px",
            backgroundColor: "#e53e3e",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "13px",
          }}
        >
          Cerrar Sesión
        </button>
      </div>

      {/* VISTAS EXCLUSIVAS SEGÚN ROL */}
      {app.usuarioLogueado.rol === "Admin" && (
        <AdminPanel
          msgRegistro={app.msgRegistro}
          nuevoUsuario={app.nuevoUsuario}
          setNuevoUsuario={app.setNuevoUsuario}
          carrerasDisponibles={app.carrerasDisponibles}
          manejarRegistroUsuario={app.manejarRegistroUsuario}
          listaUsuarios={app.listaUsuarios}
          msgAsignatura={app.msgAsignatura}
          nombreAsignatura={app.nombreAsignatura}
          setNombreAsignatura={app.setNombreAsignatura}
          codigoAsignatura={app.codigoAsignatura}
          setCodigoAsignatura={app.setCodigoAsignatura}
          periodo={app.periodo}
          setPeriodo={app.setPeriodo}
          docenteSeleccionado={app.docenteSeleccionado}
          setDocenteSeleccionado={app.setDocenteSeleccionado}
          evaluaciones={app.evaluaciones}
          agregarFilaEvaluacion={app.agregarFilaEvaluacion}
          eliminarFilaEvaluacion={app.eliminarFilaEvaluacion}
          actualizarFilaEvaluacion={app.actualizarFilaEvaluacion}
          carreraFiltradaAdmin={app.carreraFiltradaAdmin}
          setCarreraFiltradaAdmin={app.setCarreraFiltradaAdmin}
          estudiantesDisponibles={app.estudiantesDisponibles}
          estudiantesSeleccionados={app.estudiantesSeleccionados}
          manejarCheckboxEstudiante={app.manejarCheckboxEstudiante}
          manejarCrearAsignatura={app.manejarCrearAsignatura}
          manejarEliminarAsignatura={app.manejarEliminarAsignatura}
          docentesDisponibles={app.docentesDisponibles}
          listaAsignaturas={app.listaAsignaturas}
          facultadesYCarreras={app.facultadesYCarreras}
          facultadRamo={app.facultadRamo}
          setFacultadRamo={app.setFacultadRamo}
          carreraRamo={app.carreraRamo}
          setCarreraRamo={app.setCarreraRamo}
          idAsignaturaEditando={app.idAsignaturaEditando}
          activarModoEdicion={app.activarModoEdicion}
          cancelarEdicion={app.cancelarEdicion}
          manejarActualizarAsignatura={app.manejarActualizarAsignatura}
        />
      )}

      {(app.usuarioLogueado.rol === "Docente" ||
        app.usuarioLogueado.user?.rol === "Docente") && (
        <TeacherPanel
          asignaturasDocente={app.asignaturasDocente}
          asignaturaActiva={app.asignaturaActiva}
          setAsignaturaActiva={app.setAsignaturaActiva}
          msgNotas={app.msgNotas}
          buscarNotaEnBase={app.buscarNotaEnBase}
          guardarNotaServidor={app.guardarNotaServidor}
          calcularPromedioPonderado={app.calcularPromedioPonderado}
        />
      )}

      {/* VISTAS EXCLUSIVAS DEL ESTUDIANTE (HITO 4) */}
      {(app.usuarioLogueado.rol === "Estudiante" ||
        app.usuarioLogueado.user?.rol === "Estudiante") && (
        <StudentPanel
          asignaturasEstudiante={app.asignaturasEstudiante}
          calcularEstadoEstudiante={app.calcularEstadoEstudiante}
        />
      )}
    </div>
  );
}

export default App;
