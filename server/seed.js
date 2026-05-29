const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const crearAdminUnico = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB Atlas para la siembra...");

    const adminExiste = await User.findOne({ rol: 'Admin' });
    if (adminExiste) {
      console.log("Ya existe un administrador en la base de datos.");
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash('admin1234', salt);

    const nuevoAdmin = new User({
      nombre: "Administrador UCT",
      correo: "admin@uct.cl",
      password: passwordEncriptada,
      rol: "Admin"
    });

    await nuevoAdmin.save();
    console.log("🚀 ¡Administrador inicial creado con éxito!");
    console.log("Correo: admin@uct.cl | Contraseña: admin1234");
    
    process.exit();
  } catch (error) {
    console.error("Error al crear el administrador:", error);
    process.exit(1);
  }
};

crearAdminUnico();