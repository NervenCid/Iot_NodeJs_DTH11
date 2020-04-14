//Importamos el modulo 'path' para poder manipular las rutas de sistema
const path = require('path');

//Importamos la libreria
const express = require('express');
const router = express.Router();

//Llamamos al autenticador
////Protegemos las rutas con 'isNotloggedin' y con  'isLoggedIn'
const {isLoggedIn, isNotloggedin} = require('../lib/auth');

//Llamamos al controlador segun la configuracion de la base de datos
//Usamos el archivo .env
//VERIFICAR
//Opciones disponibles en '.env' para 'DATABASE_MODE': 'mongodb', 'postgres', 'firebase'
const {
    getDevices,
    getAddDevice,
    AddDevice,
    getEditDevice,
    editDevice,
    deleteDevice,
    getSingleDevice} = require(path.join(__dirname, '..', 'controllers', process.env.DATABASE_MODE, 'devicesController'));


//--------------------------------Accion: Obtener todos los dispositivos-----------------------------------

//Metodo 'GET' para obtener todos los dispositivos del usuario
router.get('/devices', isLoggedIn, getDevices);

//-----------------------------------Accion: Crear un nuevo dispositivo------------------------------------

//Metodo 'GET' para renderizar el formulario
router.get('/devices/add', isLoggedIn, getAddDevice);

//Metodo 'POST' para crear el 'device'
router.post('/devices/add', isLoggedIn, AddDevice);

//-----------------------------------Accion: Editar un nuevo dispositivo-----------------------------------

//Metodo 'GET' para renderizar el formulario de edicion (ver el archivo 'edit-device.hbs') recibimos 'id' de dispositivo
router.get('/devices/edit/:id', isLoggedIn, getEditDevice);

//Editamos mediante el metodo 'POST'
router.post('/devices/edit/:id', isLoggedIn, editDevice);


//-------------------------------------Accion: Eliminar un dispositivo-------------------------------------

//Metodo 'POST' para eliminar usando el 'id'
router.post('/devices/delete/:id', isLoggedIn, deleteDevice);

//---------------------------------Accion: Mostrar el dispositivo en detalle--------------------------------

//Metodo 'GET' para ver el dispositivo en detalle 'id'
router.get('/devices/:id', isLoggedIn, getSingleDevice);

//----------------------------------------------------------------------------------------------------------

//Exportamos el modulo
module.exports = router;