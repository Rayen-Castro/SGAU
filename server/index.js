// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("¡Conectado exitosamente a MongoDB!"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

app.get('/', (req, res) => {
  res.send('Servidor MERN funcionando correctamente');
});

const PORT = process.env.PORT || 5000;

app.post('/api/login', async (req, res) => {
  const { correo, password, rol } = req.body;
  
  console.log(`Intento de login para: ${correo} con rol: ${rol}`);

  if (correo && password) {
    res.json({ 
      success: true, 
      message: "Login correcto", 
      user: { correo, rol } 
    });
  } else {
    res.status(400).json({ success: false, message: "Faltan datos" });
  }
});


app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

const notasEjemplo = [
  { id: 1, nombre: "Certamen 1", ponderacion: 30, nota: 4.5 },
  { id: 2, nombre: "Certamen 2", ponderacion: 35, nota: 5.2 },
  { id: 3, nombre: "Examen Final", ponderacion: 35, nota: null },
];

app.get('/api/notas-estudiante', (req, res) => {
  let sumaActual = 0;
  let ponderacionAcumulada = 0;

  notasEjemplo.forEach(n => {
    if (n.nota) {
      sumaActual += (n.nota * (n.ponderacion / 100));
      ponderacionAcumulada += n.ponderacion;
    }
  });

  const ponderacionRestante = 100 - ponderacionAcumulada;
  // Fórmula: (4.0 - sumaActual) / (ponderacionRestante / 100)
  const notaNecesaria = ponderacionRestante > 0 
    ? ((4.0 - sumaActual) / (ponderacionRestante / 100)).toFixed(1) 
    : "N/A";

  res.json({
    asignatura: "Diseño de Software",
    notas: notasEjemplo,
    promedioActual: sumaActual.toFixed(2),
    notaNecesaria: notaNecesaria > 1 ? notaNecesaria : "Aprobado"
  });
});