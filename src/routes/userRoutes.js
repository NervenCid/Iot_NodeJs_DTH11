//Importamos el modulo 'path' para poder manipular las rutas de sistema
const path = require('path');

//Importamos la libreria
const express = require('express');
const router = express.Router();

const passport = require('passport');

//Llamamos al controlador segun la configuracion de la base de datos
//Usamos el archivo .env
//VERIFICAR
//Opciones disponibles en '.env' para 'DATABASE_MODE': 'mongodb', 'postgres', 'firebase'
const {
    getSignIn,
    signIn,
    getSignUp,
    signUp,
    logout} = require(path.join(__dirname, '..', 'controllers', process.env.DATABASE_MODE, 'usersController'));

const User=require(path.join(__dirname, '..', 'models', process.env.DATABASE_MODE, 'UserDB'));

//--------------------------------Accion: Ingresar a la plataforma (Usuario existente)--------------------------------

//Metodo 'GET' para renderizar el formulario
router.get('/users/signin', getSignIn);

//Metodo 'POST' para ingresar
router.post('/users/signin', signIn);

//----------------------------------Accion: Registrarse a la plataforma (Usuario nuevo)--------------------------------

//Metodo 'GET' para renderizar el formulario
router.get('/users/signup', getSignUp);

//Metodo 'POST' para registrarse
router.post('/users/signup', signUp);

//----------------------------------------------Accion: Salir de la plataforma-----------------------------------------
router.get('/users/logout', logout);

//Exportamos el modulo
module.exports = router;
