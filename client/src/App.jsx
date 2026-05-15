import React, { useState } from 'react';

function App() {
  const [logueado, setLogueado] = useState(false);
  const [datosAcademicos, setDatosAcademicos] = useState(null);
  const [error, setError] = useState('');

  const obtenerRendimientoYLogin = async (e) => {
    if(e) e.preventDefault(); 
    
    try {
      const resp = await fetch('http://localhost:5000/api/notas-estudiante');
      
      if (!resp.ok) throw new Error("Error en el servidor");

      const data = await resp.json();
      
      setDatosAcademicos(data);
      
      setLogueado(true);
      setError('');
    } catch (err) {
      setError('No se pudo conectar con el backend. ¿Está encendido node index.js?');
    }
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', padding: '30px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#004a99' }}>SGAU - Universidad Católica de Temuco</h1>
        <p>Prototipo Primera Entrega - Grupo 3</p>
      </header>

      {/* VISTA 1: LOGIN (Si no está logueado, muestra esto) */}
      {!logueado ? (
        <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(14, 15, 17, 0.1)', maxWidth: '400px', margin: 'auto' }}>
          <h2 style={{ textAlign: 'center', color: '#004a99' }}>Iniciar Sesión</h2>
          {error && <p style={{ color: '#004a99', fontSize: '14px' }}>{error}</p>}
          
          <input type="email" placeholder="Correo institucional" style={inputStyle} />
          <input type="password" placeholder="Contraseña" style={inputStyle} />
          
          <button 
            onClick={obtenerRendimientoYLogin} 
            style={buttonStyle}
          >
            Entrar como Estudiante
          </button>
        </div>
      ) : (
        /* VISTA 2: PANEL PREDICTIVO (Si está logueado, muestra la tabla) */
        <div style={{ maxWidth: '900px', margin: 'auto', background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Rendimiento: {datosAcademicos?.asignatura}</h2>
            <button onClick={() => setLogueado(false)} style={{ color: 'red', cursor: 'pointer', border: 'none', background: 'none' }}>Cerrar Sesión</button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#004a99', color: 'white' }}>
                <th style={thStyle}>Evaluación</th>
                <th style={thStyle}>Ponderación</th>
                <th style={thStyle}>Nota Actual</th>
              </tr>
            </thead>
            <tbody>
              {datosAcademicos?.notas.map(n => (
                <tr key={n.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={tdStyle}>{n.nombre}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{n.ponderacion}%</td>
                  <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 'bold', color: n.nota < 4 ? 'red' : 'black' }}>
                    {n.nota || 'Pendiente'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* EL "MOTOR DE CÁLCULO" VISUALIZADO */}
          <div style={panelPredictivoStyle}>
            <h3 style={{ marginTop: 0 }}>Panel Predictivo (Error 0%)</h3>
            <p>Tu promedio ponderado actual es: <span style={{ fontSize: '1.4em', fontWeight: 'bold' }}>{datosAcademicos?.promedioActual}</span></p>
            <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #2196f3' }}>
              <p style={{ margin: 0, color: '#004a99', fontWeight: 'bold' }}>
                🎯 Nota mínima necesaria en los ítems restantes para aprobar con 4.0:
              </p>
              <h2 style={{ margin: '10px 0 0 0', color: '#d32f2f' }}>{datosAcademicos?.notaNecesaria}</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: '12px', backgroundColor: '#004a99', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' };
const thStyle = { padding: '15px', textAlign: 'left' };
const tdStyle = { padding: '15px' };
const panelPredictivoStyle = { marginTop: '30px', padding: '25px', backgroundColor: '#e3f2fd', borderRadius: '10px', borderLeft: '8px solid #004a99' };

export default App;