import React, { useState, useEffect } from 'react';

function App() {
  // --- ESTADOS DE SESIÓN Y LOGIN ---
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [error, setError] = useState('');

  // --- ESTADOS DE GESTIÓN DE USUARIOS (HITO 1) ---
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [msgRegistro, setMsgRegistro] = useState('');
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '', correo: '', password: '', rol: 'Estudiante', carrera: 'Ingeniería Civil Informática'
  });
  const carrerasDisponibles = [
    "Ingeniería Civil Informática", "Ingeniería Civil Ambiental", "Agronomía", "Psicología", "Medicina Veterinaria"
  ];

  // --- ESTADOS DE GESTIÓN DE ASIGNATURAS (HITO 2) ---
  const [nombreAsignatura, setNombreAsignatura] = useState('');
  const [codigoAsignatura, setCodigoAsignatura] = useState('');
  const [periodo, setPeriodo] = useState('2026-1');
  const [docenteSeleccionado, setDocenteSeleccionado] = useState('');
  const [estudiantesSeleccionados, setEstudiantesSeleccionados] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([{ nombreEval: 'Certamen 1', ponderacion: 50 }, { nombreEval: 'Certamen 2', ponderacion: 50 }]);
  const [msgAsignatura, setMsgAsignatura] = useState('');
  const [listaAsignaturas, setListaAsignaturas] = useState([]);

  // --- FUNCIONES API ---
  const consultarUsuarios = async () => {
    try {
      const resp = await fetch('http://localhost:5000/api/auth/usuarios');
      const data = await resp.json();
      if (data.success) setListaUsuarios(data.usuarios);
    } catch (err) { console.error("Error al traer usuarios", err); }
  };

  const consultarAsignaturas = async () => {
    try {
      const resp = await fetch('http://localhost:5000/api/subjects');
      const data = await resp.json();
      if (data.success) setListaAsignaturas(data.asignaturas);
    } catch (err) { console.error("Error al traer asignaturas", err); }
  };

  useEffect(() => {
    if (usuarioLogueado && usuarioLogueado.rol === 'Admin') {
      consultarUsuarios();
      consultarAsignaturas();
    }
  }, [usuarioLogueado]);

  const manejarLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const resp = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password })
      });
      const data = await resp.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        setUsuarioLogueado(data.user);
      } else {
        setError(data.msg || 'Error al iniciar sesión');
      }
    } catch (err) { setError('No se pudo conectar con el servidor backend.'); }
  };

  const manejarRegistroUsuario = async (e) => {
    e.preventDefault();
    setMsgRegistro('');
    try {
      const resp = await fetch('http://localhost:5000/api/auth/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoUsuario)
      });
      const data = await resp.json();
      if (data.success) {
        setMsgRegistro(`✅ ${data.msg}`);
        consultarUsuarios();
        setNuevoUsuario({ nombre: '', correo: '', password: '', rol: 'Estudiante', carrera: 'Ingeniería Civil Informática' });
      } else { setMsgRegistro(`❌ ${data.msg}`); }
    } catch (err) { setMsgRegistro('❌ Error al registrar usuario.'); }
  };

  // --- LÓGICA DINÁMICA DE EVALUACIONES (HITO 2) ---
  const agregarFilaEvaluacion = () => {
    setEvaluaciones([...evaluaciones, { nombreEval: '', ponderacion: 0 }]);
  };

  const actualizarFilaEvaluacion = (index, campo, valor) => {
    const nuevasEval = [...evaluaciones];
    nuevasEval[index][campo] = valor;
    setEvaluaciones(nuevasEval);
  };

  const eliminarFilaEvaluacion = (index) => {
    setEvaluaciones(evaluaciones.filter((_, i) => i !== index));
  };

  const manejarCheckboxEstudiante = (id) => {
    if (estudiantesSeleccionados.includes(id)) {
      setEstudiantesSeleccionados(estudiantesSeleccionados.filter(eId => eId !== id));
    } else {
      setEstudiantesSeleccionados([...estudiantesSeleccionados, id]);
    }
  };

  const manejarCrearAsignatura = async (e) => {
    e.preventDefault();
    setMsgAsignatura('');

    if (!docenteSeleccionado) {
      setMsgAsignatura('❌ Debes seleccionar un docente para la asignatura.');
      return;
    }
    if (estudiantesSeleccionados.length === 0) {
      setMsgAsignatura('❌ Debes seleccionar al menos un estudiante.');
      return;
    }

    const payload = {
      nombreAsignatura,
      codigo: codigoAsignatura,
      periodo,
      docenteId: docenteSeleccionado,
      estudiantesIds: estudiantesSeleccionados,
      evaluaciones
    };

    try {
      const resp = await fetch('http://localhost:5000/api/subjects/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();

      if (data.success) {
        setMsgAsignatura(`✅ ${data.msg}`);
        consultarAsignaturas();
        setNombreAsignatura('');
        setCodigoAsignatura('');
        setEstudiantesSeleccionados([]);
        setEvaluaciones([{ nombreEval: 'Certamen 1', ponderacion: 50 }, { nombreEval: 'Certamen 2', ponderacion: 50 }]);
      } else {
        setMsgAsignatura(`❌ ${data.msg}`);
      }
    } catch (err) { setMsgAsignatura('❌ Error de red al crear asignatura.'); }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    setUsuarioLogueado(null);
    setListaUsuarios([]);
    setListaAsignaturas([]);
  };

  // Filtrar usuarios por rol para los selectores
  const docentesDisponibles = listaUsuarios.filter(u => u.role === 'Docente' || u.rol === 'Docente');
  const estudiantesDisponibles = listaUsuarios.filter(u => u.role === 'Estudiante' || u.rol === 'Estudiante');

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#004a99', margin: 0 }}>SGAU - Universidad Católica de Temuco</h1>
        <p style={{ color: '#555', margin: '5px 0 0 0' }}>Gestión Académica & Rendimiento Predictivo</p>
      </header>

      {!usuarioLogueado ? (
        <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', maxWidth: '400px', margin: 'auto' }}>
          <h2 style={{ textAlign: 'center', color: '#333', marginTop: 0 }}>Iniciar Sesión</h2>
          {error && <p style={{ color: 'white', backgroundColor: '#e53e3e', padding: '10px', borderRadius: '5px', fontSize: '14px' }}>{error}</p>}
          <form onSubmit={manejarLogin}>
            <input type="email" placeholder="Correo" required value={correo} onChange={(e) => setCorreo(e.target.value)} style={inputStyle} />
            <input type="password" placeholder="Contraseña" required value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
            <button type="submit" style={buttonStyle}>Ingresar al Sistema</button>
          </form>
        </div>
      ) : (
        <div style={{ maxWidth: '1200px', margin: 'auto', background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ margin: 0 }}>Bienvenido, {usuarioLogueado.nombre}</h2>
              <span style={{ backgroundColor: '#004a99', color: 'white', padding: '3px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>Rol: {usuarioLogueado.rol}</span>
            </div>
            <button onClick={cerrarSesion} style={{ color: '#e53e3e', cursor: 'pointer', border: '1px solid #e53e3e', background: 'none', padding: '8px 15px', borderRadius: '5px', fontWeight: 'bold' }}>Cerrar Sesión</button>
          </div>

          {usuarioLogueado.rol === 'Admin' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
              
              {/* SECCIÓN 1: GESTIÓN DE USUARIOS (HITO 1) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderBottom: '2px dashed #e2e8f0', paddingBottom: '30px' }}>
                <div>
                  <h3>⚙️ Registrar Nuevo Usuario (Hito 1)</h3>
                  {msgRegistro && <p style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#edf2f7', fontWeight: 'bold', fontSize: '13px' }}>{msgRegistro}</p>}
                  <form onSubmit={manejarRegistroUsuario} style={{ display: 'grid', gap: '8px', background: '#f7fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <input type="text" placeholder="Nombre completo" required value={nuevoUsuario.nombre} onChange={(e) => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})} style={inputStyle} />
                    <input type="text" placeholder="Correo electrónico" required value={nuevoUsuario.correo} onChange={(e) => setNuevoUsuario({...nuevoUsuario, correo: e.target.value})} style={inputStyle} />
                    <p style={{ fontSize: '11px', color: '#718096', margin: '-5px 0 5px 0' }}>💡 Dominio automático: <strong>{nuevoUsuario.rol === 'Estudiante' ? '@alu.uct.cl' : '@uct.cl'}</strong></p>
                    <input type="password" placeholder="Contraseña inicial" required value={nuevoUsuario.password} onChange={(e) => setNuevoUsuario({...nuevoUsuario, password: e.target.value})} style={inputStyle} />
                    <select value={nuevoUsuario.rol} onChange={(e) => setNuevoUsuario({...nuevoUsuario, rol: e.target.value, carrera: e.target.value === 'Docente' ? '' : carrerasDisponibles[0]})} style={inputStyle}>
                      <option value="Estudiante">Estudiante</option>
                      <option value="Docente">Docente</option>
                    </select>
                    {nuevoUsuario.rol === 'Estudiante' && (
                      <select value={nuevoUsuario.carrera} onChange={(e) => setNuevoUsuario({...nuevoUsuario, carrera: e.target.value})} style={inputStyle}>
                        {carrerasDisponibles.map((c, i) => <option key={i} value={c}>{c}</option>)}
                      </select>
                    )}
                    <button type="submit" style={{ ...buttonStyle, backgroundColor: '#2b6cb0' }}>Guardar Usuario</button>
                  </form>
                </div>
                <div>
                  <h3>👥 Usuarios en Base de Datos</h3>
                  <div style={{ maxHeight: '230px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead style={{ backgroundColor: '#edf2f7', position: 'sticky', top: 0 }}>
                        <tr><th style={{ padding: '8px', textAlign: 'left' }}>Nombre / Correo</th><th style={{ padding: '8px', textAlign: 'left' }}>Rol</th><th style={{ padding: '8px', textAlign: 'left' }}>Carrera</th></tr>
                      </thead>
                      <tbody>
                        {listaUsuarios.map(u => (
                          <tr key={u._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '8px' }}><strong>{u.nombre}</strong><br/><span style={{ color: '#718096', fontSize: '11px' }}>{u.correo}</span></td>
                            <td style={{ padding: '8px' }}><span style={{ fontSize: '11px', padding: '2px 5px', borderRadius: '4px', fontWeight: 'bold', backgroundColor: u.rol === 'Docente' ? '#feebc8' : u.rol === 'Admin' ? '#e2e8f0' : '#e2f0d9' }}>{u.rol}</span></td>
                            <td style={{ padding: '8px', color: '#4a5568' }}>{u.carrera || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: CREACIÓN DE ASIGNATURAS (HITO 2) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }}>
                <div>
                  <h3>📘 Configurar Nueva Asignatura y Ponderaciones (Hito 2)</h3>
                  {msgAsignatura && <p style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#e2e8f0', fontWeight: 'bold', fontSize: '13px' }}>{msgAsignatura}</p>}
                  
                  <form onSubmit={manejarCrearAsignatura} style={{ background: '#f7fafc', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e0', display: 'grid', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                      <input type="text" placeholder="Nombre Materia (Ej: Estructura de Datos)" required value={nombreAsignatura} onChange={(e) => setNombreAsignatura(e.target.value)} style={inputStyle} />
                      <input type="text" placeholder="Código (Ej: INF-2204)" required value={codigoAsignatura} onChange={(e) => setCodigoAsignatura(e.target.value)} style={inputStyle} />
                      <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} style={inputStyle}>
                        <option value="2026-1">Periodo 2026-1</option>
                        <option value="2026-2">Periodo 2026-2</option>
                      </select>
                    </div>

                    {/* Seleccionar Profesor */}
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#4a5568' }}>👨‍🏫 Asignar Docente Titular:</label>
                      <select value={docenteSeleccionado} onChange={(e) => setDocenteSeleccionado(e.target.value)} style={{ ...inputStyle, marginTop: '5px' }}>
                        <option value="">-- Seleccione un Profesor --</option>
                        {docentesDisponibles.map(d => <option key={d._id} value={d._id}>{d.nombre} ({d.correo})</option>)}
                      </select>
                    </div>

                    {/* Diseñar Evaluaciones Dinámicas */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#4a5568' }}>📝 Plan de Evaluaciones (Suma debe ser 100%):</label>
                        <button type="button" onClick={agregarFilaEvaluacion} style={{ backgroundColor: '#38a169', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>+ Añadir Evaluación</button>
                      </div>
                      
                      {evaluaciones.map((ev, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '6px' }}>
                          <input type="text" placeholder="Ej: Certamen 1" required value={ev.nombreEval} onChange={(e) => actualizarFilaEvaluacion(index, 'nombreEval', e.target.value)} style={inputStyle} />
                          <input type="number" placeholder="%" min="1" max="100" required value={ev.ponderacion} onChange={(e) => actualizarFilaEvaluacion(index, 'ponderacion', e.target.value)} style={{ ...inputStyle, width: '90px' }} />
                          {evaluaciones.length > 1 && (
                            <button type="button" onClick={() => eliminarFilaEvaluacion(index)} style={{ backgroundColor: '#e53e3e', color: 'white', border: 'none', padding: '0 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                          )}
                        </div>
                      ))}
                      <div style={{ textAlign: 'right', fontSize: '12px', fontWeight: 'bold', color: evaluaciones.reduce((t, e) => t + Number(e.ponderacion), 0) === 100 ? '#2f855a' : '#c53030' }}>
                        Suma actual: {evaluaciones.reduce((t, e) => t + Number(e.ponderacion), 0)}%
                      </div>
                    </div>
                        
                    {/* Inscribir Alumnos mediante Checkboxes con FILTRO INTERACTIVO */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#4a5568' }}>🎓 Inscribir Estudiantes:</label>
                        
                        {/* 🔥 NUEVO FILTRO EN TIEMPO REAL */}
                        <div style={{ fontSize: '12px' }}>
                          <span style={{ color: '#718096', marginRight: '5px' }}>Filtrar por carrera:</span>
                          <select 
                            id="filtroCarreraEstudiantes"
                            style={{ padding: '2px 5px', borderRadius: '4px', border: '1px solid #cbd5e0', fontSize: '12px', backgroundColor: '#fff' }}
                            onChange={(e) => {
                              // Guardamos la carrera seleccionada en un atributo temporal del DOM o estado
                              window.carreraFiltrada = e.target.value;
                              // Forzamos un re-renderizado rápido de React simulando un cambio cosmético
                              setNombreAsignatura(prev => prev); 
                            }}
                          >
                            <option value="TODAS">-- Todas las Carreras --</option>
                            {carrerasDisponibles.map((c, i) => <option key={i} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>

                      <div style={{ background: 'white', border: '1px solid #cbd5e0', borderRadius: '6px', padding: '10px', maxHeight: '120px', overflowY: 'auto' }}>
                        {estudiantesDisponibles.length === 0 ? (
                          <p style={{ fontSize: '12px', color: '#718096', margin: 0 }}>No hay estudiantes registrados aún.</p>
                        ) : (
                          estudiantesDisponibles
                            .filter(est => {
                              // Si el filtro está en "TODAS" o no se ha definido, pasan todos
                              if (!window.carreraFiltrada || window.carreraFiltrada === 'TODAS') return true;
                              // Si hay filtro, solo pasan los que coincidan exactamente con la carrera
                              return est.carrera === window.carreraFiltrada;
                            })
                            .map(est => (
                              <div key={est._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', fontSize: '13px' }}>
                                <input 
                                  type="checkbox" 
                                  id={est._id} 
                                  checked={estudiantesSeleccionados.includes(est._id)} 
                                  onChange={() => manejarCheckboxEstudiante(est._id)} 
                                  style={{ marginRight: '8px' }} 
                                />
                                <label htmlFor={est._id}>
                                  <strong>{est.nombre}</strong> - <span style={{ color: '#4a5568', fontSize: '12px' }}>{est.carrera}</span>
                                </label>
                              </div>
                            ))
                        )}
                        {/* Mensaje de ayuda si el filtro deja la lista vacía */}
                        {window.carreraFiltrada && window.carreraFiltrada !== 'TODAS' && 
                        estudiantesDisponibles.filter(est => est.carrera === window.carreraFiltrada).length === 0 && (
                          <p style={{ fontSize: '11px', color: '#e53e3e', margin: '5px 0 0 0', fontStyle: 'italic' }}>
                            ⚠️ No hay alumnos registrados en esta carrera específica para este semestre.
                          </p>
                        )}
                      </div>
                    </div>

                    <button type="submit" style={{ ...buttonStyle, backgroundColor: '#d69e2e', marginTop: '5px' }}>Crear Asignatura en Atlas</button>
                  </form>
                </div>

                {/* Lista de Asignaturas Creadas */}
                <div>
                  <h3>📋 Asignaturas Registradas</h3>
                  <div style={{ display: 'grid', gap: '10px', maxHeight: '520px', overflowY: 'auto' }}>
                    {listaAsignaturas.length === 0 ? <p style={{ fontSize: '13px', color: '#718096' }}>No hay asignaturas creadas en el sistema.</p> : 
                      listaAsignaturas.map(asig => (
                        <div key={asig._id} style={{ border: '1px solid #cbd5e0', padding: '12px', borderRadius: '8px', backgroundColor: '#f7fafc' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <h4 style={{ margin: 0, color: '#2b6cb0' }}>{asig.nombreAsignatura}</h4>
                            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#718096' }}>{asig.codigo}</span>
                          </div>
                          <p style={{ margin: '4px 0', fontSize: '12px' }}><strong>Profesor:</strong> {asig.docente?.nombre || 'No asignado'}</p>
                          <p style={{ margin: '4px 0', fontSize: '12px' }}><strong>Alumnos:</strong> {asig.estudiantesInscritos?.length || 0} inscritos</p>
                          
                          <div style={{ marginTop: '8px', background: 'white', padding: '6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#4a5568' }}>Evaluaciones fijadas:</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '3px' }}>
                              {asig.evaluaciones?.map((ev, i) => (
                                <span key={i} style={{ fontSize: '10px', backgroundColor: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>{ev.nombreEval} ({ev.ponderacion}%)</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* VISTAS OTROS ROLES (Hitos 3 y 4) */}
          {usuarioLogueado.rol === 'Docente' && <div style={{ marginTop: '20px' }}><h3>👨‍🏫 Panel del Docente</h3><p>Hito 3: Carga de calificaciones para tus materias.</p></div>}
          {usuarioLogueado.rol === 'Estudiante' && <div style={{ marginTop: '20px' }}><h3>🎓 Panel del Estudiante</h3><p>Hito 4: Visualización predictiva de notas.</p></div>}
        </div>
      )}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '8px', marginBottom: '2px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontSize: '13px' };
const buttonStyle = { width: '100%', padding: '10px', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' };

export default App;