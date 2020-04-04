//Aqui creamos los esquemas de datos para los usuarios

//Importamos las librerias
const mongoose = require('mongoose');
const { Schema } = mongoose;

const bcrypt = require('bcryptjs'); //Este modulo es para cifrar los password

//Creamos el esquema: Le decimos a mongo como luciran los datos del usuario
UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  //date: { type: Date, default: Date.now }
});

//Ciframos los password
UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10); // Pasamos el algoritmo de cifrado 10 veces
    const hash = bcrypt.hash(password, salt); // Creamos el hash
    return hash;
};

//Comparamos el password proporcionado por el usuario con el almacenado en la base de datos
UserSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password);
};

//Exportamos el modulo
module.exports = mongoose.model('User', UserSchema);