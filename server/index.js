const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('¡Conexión exitosa a MongoDB Atlas!'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/asignatura', require('./routes/asignaturaRoutes'));
app.use('/api/grades', require('./routes/gradeRoutes')); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});