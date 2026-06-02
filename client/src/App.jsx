import React, { useState, useEffect } from 'react';

function App() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [error, setError] = useState('');

  // Estado para la lista de usuarios registrados en el sistema
  const [listaUsuarios, setListaUsuarios] = useState([]);

  // Formulario de registro (Carrera ahora inicia con la primera opción de la lista)
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '', correo: '', password: '', rol: 'Estudiante', carrera: 'Ingeniería Civil Informática'
  });
  const [msgRegistro, setMsgRegistro] = useState('');

  // Lista de carreras oficiales de muestra (UCT)
  const carrerasDisponibles = [
    "Ingeniería Civil Informática",
    "Ingeniería Civil Ambiental",
    "Agronomía",
    "Psicología",
    "Medicina Veterinaria"
  ];

  const consultarUsuarios = async () => {
    try {
      const resp = await fetch('http://localhost:5000/api/auth/usuarios');
      const data = await resp.json();
      if (data.success) {
        setListaUsuarios(data.usuarios);
      }
    } catch (err) {
      console.error("Error al traer usuarios", err);
    }
  };

  useEffect(() => {
    if (usuarioLogueado && usuarioLogueado.rol === 'Admin') {
      consultarUsuarios();
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
        // Si es Admin, cargamos la lista de usuarios inmediatamente al entrar
        if (data.user.rol === 'Admin') {
          consultarUsuarios();
        }
      } else {
        setError(data.msg || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor backend.');
    }
  };

  const manejarRegistro = async (e) => {
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
        // Actualizamos la tabla automáticamente al crear uno nuevo
        consultarUsuarios();
        // Limpiamos el formulario manteniendo la carrera por defecto
        setNuevoUsuario({ nombre: '', correo: '', password: '', rol: 'Estudiante', carrera: 'Ingeniería Civil Informática' });
      } else {
        setMsgRegistro(`❌ ${data.msg}`);
      }
    } catch (err) {
      setMsgRegistro('❌ Error de conexión al registrar usuario.');
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    setUsuarioLogueado(null);
    setListaUsuarios([]);
    setCorreo('');
    setPassword('');
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', padding: '30px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#004a99', margin: 0 }}>SGAU - Universidad Católica de Temuco</h1>
        <p style={{ color: '#555' }}>Gestión Académica & Rendimiento Predictivo</p>
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
        <div style={{ maxWidth: '1000px', margin: 'auto', background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
            <div>
              <h2 style={{ margin: 0 }}>Bienvenido, {usuarioLogueado.nombre}</h2>
              <span style={{ backgroundColor: '#004a99', color: 'white', padding: '3px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>Rol: {usuarioLogueado.rol}</span>
            </div>
            <button onClick={cerrarSesion} style={{ color: '#e53e3e', cursor: 'pointer', border: '1px solid #e53e3e', background: 'none', padding: '8px 15px', borderRadius: '5px', fontWeight: 'bold' }}>Cerrar Sesión</button>
          </div>

          {/* PANEL EXCLUSIVO ADMIN */}
          {usuarioLogueado.rol === 'Admin' && (
            <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
              
              {/* Columna Izquierda: Formulario de Registro */}
              <div>
                <h3>⚙️ Registrar Nuevo Usuario</h3>
                {msgRegistro && <p style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#edf2f7', fontWeight: 'bold', fontSize: '14px' }}>{msgRegistro}</p>}

                <form onSubmit={manejarRegistro} style={{ display: 'grid', gap: '10px', background: '#f7fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <input type="text" placeholder="Nombre completo" required value={nuevoUsuario.nombre} onChange={(e) => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})} style={inputStyle} />
                  <input type="email" placeholder="Correo electrónico" required value={nuevoUsuario.correo} onChange={(e) => setNuevoUsuario({...nuevoUsuario, correo: e.target.value})} style={inputStyle} />
                  <input type="password" placeholder="Contraseña inicial" required value={nuevoUsuario.password} onChange={(e) => setNuevoUsuario({...nuevoUsuario, password: e.target.value})} style={inputStyle} />
                  
                  <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#4a5568' }}>Tipo de Usuario:</label>
                  <select value={nuevoUsuario.rol} onChange={(e) => setNuevoUsuario({...nuevoUsuario, rol: e.target.value, carrera: e.target.value === 'Docente' ? '' : carrerasDisponibles[0]})} style={inputStyle}>
                    <option value="Estudiante">Estudiante</option>
                    <option value="Docente">Docente</option>
                  </select>
                  
                  {/* SELECTOR DE CARRERAS DINÁMICO (Punto 1) */}
                  {nuevoUsuario.rol === 'Estudiante' && (
                    <>
                      <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#4a5568' }}>Seleccione Carrera:</label>
                      <select value={nuevoUsuario.carrera} onChange={(e) => setNuevoUsuario({...nuevoUsuario, carrera: e.target.value})} style={inputStyle}>
                        {carrerasDisponibles.map((c, index) => (
                          <option key={index} value={c}>{c}</option>
                        ))}
                      </select>
                    </>
                  )}

                  <button type="submit" style={{ ...buttonStyle, backgroundColor: '#2b6cb0', marginTop: '10px' }}>Guardar en Atlas</button>
                </form>
              </div>

              {/* Columna Derecha: Visualización de Base de Datos (Punto 2) */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>👥 Usuarios en el Sistema</h3>
                  <button onClick={consultarUsuarios} style={{ backgroundColor: '#4a5568', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>🔄 Actualizar</button>
                </div>
                
                <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#edf2f7', borderBottom: '2px solid #cbd5e0', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>Nombre</th>
                        <th style={{ padding: '10px' }}>Rol</th>
                        <th style={{ padding: '10px' }}>Detalle / Carrera</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listaUsuarios.map((u) => (
                        <tr key={u._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '10px' }}>
                            <div style={{ fontWeight: 'bold' }}>{u.nombre}</div>
                            <div style={{ fontSize: '12px', color: '#718096' }}>{u.correo}</div>
                          </td>
                          <td style={{ padding: '10px' }}>
                            <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', backgroundColor: u.rol === 'Docente' ? '#feebc8' : u.rol === 'Admin' ? '#e2e8f0' : '#e2f0d9', color: u.rol === 'Docente' ? '#c05621' : '#2f855a' }}>
                              {u.rol}
                            </span>
                          </td>
                          <td style={{ padding: '10px', fontSize: '12px', color: '#4a5568' }}>
                            {u.rol === 'Estudiante' ? u.carrera : 'N/A (Personal)'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* VISTAS TEMPORALES OTROS ROLES */}
          {usuarioLogueado.rol === 'Docente' && <div style={{ marginTop: '20px' }}><h3>👨‍🏫 Panel del Docente</h3><p>Hito 2: Configuración de asignaturas y notas.</p></div>}
          {usuarioLogueado.rol === 'Estudiante' && <div style={{ marginTop: '20px' }}><h3>🎓 Panel del Estudiante</h3><p>Hito 4: Visualización predictiva.</p></div>}
        </div>
      )}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px', marginBottom: '5px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: '12px', backgroundColor: '#004a99', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' };

export default App;