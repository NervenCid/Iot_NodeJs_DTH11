//Importamos 'express'
const express = require('express');

//Con el modulo 'dotenv' importamos las variables de entorno
//contenidas dentro del archivo '.env'
//Se recomienda correr este proyecto con permisos de administrador
require('dotenv').config();

//Importamos 'morgan'
const morgan = require('morgan');

//Importamos el modulo 'path' para poder manipular las rutas de sistema
const path = require('path');

//Importamos 'cors'
const cors = require('cors');

//Creamos una aplicacion
const app = express();

//Importamos 'handlebars'
const exphbs = require('express-handlebars');

//Importamos el modulo de sesiones de 'express'
const session = require('express-session');

//Importamos 'flash' para mostrar mensajes
const flash = require('connect-flash');

//Importamos el validador de 'express'
const validator = require('express-validator');

//Importamos 'passport'
const passport = require('passport');

//Importamos 'method-override'
const methodOverride = require('method-override');

// Llamamos la configuracion de autenticacion dentro de 'passport.js'
require('./lib/passport'); 

//Importamos la configuracion de la base de datos
//Usamos el archivo .env
//VERIFICAR
//Opciones disponibles en '.env' para 'DATABASE_MODE': 'mongodb', 'postgres', 'firebase'
require(path.join(__dirname, 'database', process.env.DATABASE_MODE));

//------------------------------------CONFIGURACIONES-----------------------------------

//Configuramos la session
//ANTRES DE USAR FLASH
app.use(session({
    secret: 'bictia',
    resave: 'true',
    saveUninitialized: true
})); 

//Definimos el puerto
app.set('port', process.env.PORT || 3000);

//Habilitamos 'cors' para poder comunicarnos con el frontend
app.use(cors()); 

//Archivos estaticos (html estatico, iconos, js, css, etc...) y los asignamos a una ruta 'static'
app.use('/static', express.static(path.join(__dirname, 'public')));

//Indicamos donde estan las vistas
app.set('views', path.join(__dirname, 'views')); 

//Configuramos passport
app.use(passport.initialize()); 

//Configuracion del motor de plantillas
app.engine('.hbs', exphbs({
    //El archivo dentro de views/layouts debe llamarse main.hbs
    defaultLayout: 'main',
    //Indicamos donde estan los directorios de 'layouts' y 'partials'
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    //Indicamos la extension de los archivos de plantilla handlebars (.hbs)
    extname: '.hbs',
    // Definimos la ubicacion de algunas funciones auxiliares
    //Verifique que el nombre coincida con 'handlebars.js'
    helpers: require('./lib/handlebars')
})); //Configuramos el motor de plantillas

//--------------------------------------MIDDLEWARES-------------------------------------

//Configuramos 'morgan' en modo 'dev' para recibir mensajes de estado del servidor
app.use(morgan('dev'));

//Permitimos que el servidor entienda formato json
app.use(express.json());

//Usamos la session declarada arriba
app.use(passport.session()); 

//Utilizamos la configuracion del motor de plantillas
app.set('view engine', '.hbs');

//Permite recibir los datos de formulario en texto plano
app.use(express.urlencoded({extended: false})); 

//Usamos flash
app.use(flash()); 

//Variables globales
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next(); //Continuamos con las siguientes rutas
}); //Configuramos para que los mensajes se muestren en todas las ventanas

//----------------------------------------RUTAS-----------------------------------------

//Definimos la ubicacion de las rutas
//Opciones disponibles en '.env' para 'DATABASE_MODE': 'mongodb', 'postgres', 'firebase'
app.use(require(path.join(__dirname, 'routes', 'mainPageRoutes')));
app.use(require(path.join(__dirname, 'routes', 'userRoutes')));
app.use(require(path.join(__dirname, 'routes', 'deviceRoutes')));

//--------------------------------------------------------------------------------------

//Exportamos el modulo
module.exports = app;