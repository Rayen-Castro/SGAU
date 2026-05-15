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