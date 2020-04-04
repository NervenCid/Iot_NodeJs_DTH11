//Aqui creamos los esquemas de datos para las notas

//Importamos las librerias
const mongoose = require('mongoose');
const { Schema } = mongoose;

//Creamos el esquema: Le decimos a mongo como luciran los datos de la nota
DeviceSchema = new Schema({

    deviceName: {type: String, required: true},
    
    //Almacenamos el usuario para que solo vea lo que dicho usuario creo con su cuenta
    userOwnerName: {type: String, required: true},
    userOwnerId: {type: String, required: true},

    //Este es un 'token' unico para el dispositivo
    token: {type: String},

    temperature: {type: String, required: true},
    humidity: {type: String, required: true},
    
    date: {type: Date, default: Date.now}
    
});

//Exportamos el modulo
module.exports = mongoose.model('Device', DeviceSchema);