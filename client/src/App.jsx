import React, { useState } from 'react';

function App() {
  const [datos, setDatos] = useState({ correo: '', password: '', rol: '' });
  const [mensaje, setMensaje] = useState('');

  const manejarLogin = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      const resultado = await respuesta.json();
      
      if (resultado.success) {
        setMensaje(`¡Bienvenido ${resultado.user.rol}! Conectado al SGAU.`);
      } else {
        setMensaje("Error al iniciar sesión.");
      }
    } catch (error) {
      setMensaje("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div style={{ fontFamily: 'Arial', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: '#004a99' }}>SGAU - Gestión Académica</h1>
      <p style={{ color: 'green' }}>{mensaje}</p>
      
      <form onSubmit={manejarLogin} style={{ maxWidth: '300px', margin: 'auto', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h3>Iniciar Sesión</h3>
        <input 
          type="email" placeholder="Correo" required
          onChange={(e) => setDatos({...datos, correo: e.target.value})}
          style={{ width: '100%', marginBottom: '10px' }} 
        />
        <input 
          type="password" placeholder="Contraseña" required
          onChange={(e) => setDatos({...datos, password: e.target.value})}
          style={{ width: '100%', marginBottom: '10px' }} 
        />
        <select 
          required
          onChange={(e) => setDatos({...datos, rol: e.target.value})}
          style={{ width: '106%', marginBottom: '10px' }}
        >
          <option value="">Selecciona tu Rol</option>
          <option value="Estudiante">Estudiante</option>
          <option value="Docente">Docente</option>
          <option value="Admin">Administrador</option>
        </select>
        <button type="submit" style={{ backgroundColor: '#004a99', color: 'white', padding: '10px', width: '106%', border: 'none', cursor: 'pointer' }}>
          Entrar al Sistema
        </button>
      </form>
    </div>
  );
}

export default App;