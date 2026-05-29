import React, { useState } from 'react';

function App() {
  // Estados para el login y control de sesión
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [error, setError] = useState('');

  // Estados para el formulario de registro (Solo visible para el Admin)
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '', correo: '', password: '', rol: 'Estudiante', carrera: ''
  });
  const [msgRegistro, setMsgRegistro] = useState('');

  // FUNCIÓN 1: Enviar datos de Login al Backend
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
        // Guardamos el token en el almacenamiento del navegador por seguridad
        localStorage.setItem('token', data.token);
        setUsuarioLogueado(data.user);
      } else {
        setError(data.msg || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor backend.');
    }
  };

  // FUNCIÓN 2: Crear usuarios desde el panel de Admin
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
        // Limpiar formulario de registro
        setNuevoUsuario({ nombre: '', correo: '', password: '', rol: 'Estudiante', carrera: '' });
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
    setCorreo('');
    setPassword('');
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', padding: '30px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#004a99', margin: 0 }}>SGAU - Universidad Católica de Temuco</h1>
        <p style={{ color: '#555' }}>Gestión Académica & Rendimiento Predictivo</p>
      </header>

      {/* VISTA 1: LOGIN (Si no hay sesión iniciada) */}
      {!usuarioLogueado ? (
        <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', maxWidth: '400px', margin: 'auto' }}>
          <h2 style={{ textAlign: 'center', color: '#333', marginTop: 0 }}>Iniciar Sesión</h2>
          {error && <p style={{ color: 'white', backgroundColor: '#e53e3e', padding: '10px', borderRadius: '5px', fontSize: '14px' }}>{error}</p>}
          
          <form onSubmit={manejarLogin}>
            <input 
              type="email" placeholder="Correo institucional" required value={correo}
              onChange={(e) => setCorreo(e.target.value)} style={inputStyle} 
            />
            <input 
              type="password" placeholder="Contraseña" required value={password}
              onChange={(e) => setPassword(e.target.value)} style={inputStyle} 
            />
            <button type="submit" style={buttonStyle}>Ingresar al Sistema</button>
          </form>
        </div>
      ) : (
        /* VISTA 2: PANELES SEGÚN EL ROL */
        <div style={{ maxWidth: '800px', margin: 'auto', background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
            <div>
              <h2 style={{ margin: 0 }}>Bienvenido, {usuarioLogueado.nombre}</h2>
              <span style={{ backgroundColor: '#004a99', color: 'white', padding: '3px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>
                Rol: {usuarioLogueado.rol}
              </span>
            </div>
            <button onClick={cerrarSesion} style={{ color: '#e53e3e', cursor: 'pointer', border: '1px solid #e53e3e', background: 'none', padding: '8px 15px', borderRadius: '5px', fontWeight: 'bold' }}>
              Cerrar Sesión
            </button>
          </div>

          {/* CASO A: PANEL DEL ADMINISTRADOR (Registrar Usuarios) */}
          {usuarioLogueado.rol === 'Admin' && (
            <div style={{ marginTop: '20px' }}>
              <h3>⚙️ Panel de Gestión de Usuarios (Exclusivo Admin)</h3>
              <p>Como Administrador institucional, puedes registrar Docentes y Estudiantes en MongoDB Atlas.</p>
              
              {msgRegistro && <p style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#edf2f7', fontWeight: 'bold' }}>{msgRegistro}</p>}

              <form onSubmit={manejarRegistro} style={{ display: 'grid', gap: '10px', background: '#f7fafc', padding: '20px', borderRadius: '8px' }}>
                <input 
                  type="text" placeholder="Nombre completo" required value={nuevoUsuario.nombre}
                  onChange={(e) => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})} style={inputStyle}
                />
                <input 
                  type="email" placeholder="Correo electrónico" required value={nuevoUsuario.correo}
                  onChange={(e) => setNuevoUsuario({...nuevoUsuario, correo: e.target.value})} style={inputStyle}
                />
                <input 
                  type="password" placeholder="Contraseña inicial" required value={nuevoUsuario.password}
                  onChange={(e) => setNuevoUsuario({...nuevoUsuario, password: e.target.value})} style={inputStyle}
                />
                <select 
                  value={nuevoUsuario.rol} 
                  onChange={(e) => setNuevoUsuario({...nuevoUsuario, rol: e.target.value})} style={inputStyle}
                >
                  <option value="Estudiante">Estudiante</option>
                  <option value="Docente">Docente</option>
                </select>
                
                {nuevoUsuario.rol === 'Estudiante' && (
                  <input 
                    type="text" placeholder="Carrera (Ej: Ingeniería Civil Informática)" value={nuevoUsuario.carrera}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, carrera: e.target.value})} style={inputStyle}
                  />
                )}

                <button type="submit" style={{ ...buttonStyle, backgroundColor: '#2b6cb0' }}>Registrar en la Base de Datos</button>
              </form>
            </div>
          )}

          {/* CASO B: PANEL DEL DOCENTE (Pendiente para el Hito 2) */}
          {usuarioLogueado.rol === 'Docente' && (
            <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#feebc8', borderRadius: '8px' }}>
              <h3>👨‍🏫 Panel del Docente</h3>
              <p>Próximamente: Aquí podrás crear tus asignaturas, ponderaciones y subir calificaciones.</p>
            </div>
          )}

          {/* CASO C: PANEL DEL ESTUDIANTE (Pendiente para el Hito 4) */}
          {usuarioLogueado.rol === 'Estudiante' && (
            <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#e2e8f0', borderRadius: '8px' }}>
              <h3>🎓 Panel de Rendimiento Académico</h3>
              <p>Próximamente: Visualización de tus asignaturas inscritas y cálculo predictivo (error del 0%).</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Estilos limpios inline
const inputStyle = { width: '100%', padding: '10px', marginBottom: '5px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: '12px', backgroundColor: '#004a99', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', transition: 'background 0.2s' };

export default App;