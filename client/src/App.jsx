import React from 'react';

function App() {
  return (
    <div style={{ fontFamily: 'Arial', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: '#004a99' }}>SGAU - Sistema de Gestión Académica</h1>
      <p>Bienvenido al prototipo de la Primera Entrega</p>
      
      {/* Formulario Simple de Login */}
      <div style={{ maxWidth: '300px', margin: 'auto', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h3>Iniciar Sesión</h3>
        <input type="email" placeholder="Correo institucional" style={{ width: '100%', marginBottom: '10px' }} />
        <input type="password" placeholder="Contraseña" style={{ width: '100%', marginBottom: '10px' }} />
        
        <select style={{ width: '104%', marginBottom: '10px' }}>
          <option>Selecciona tu Rol</option>
          <option>Estudiante</option>
          <option>Docente</option>
          <option>Administrador</option>
        </select>
        
        <button style={{ backgroundColor: '#004a99', color: 'white', border: 'none', padding: '10px', width: '104%', cursor: 'pointer' }}>
          Entrar
        </button>
      </div>
    </div>
  );
}

export default App;