//Importamos el administrador 'firebase-admin'
const admin = require('firebase-admin');

//Definimos la ubicacion del archivo json de autenticacion generado en firebase
//Tambien podemos usar variables de entorno, pero me gusta mas este metodo
//Cuidado porque el autocompletado no sirve
var serviceAccount = require('../../node-firebase-ejemplo-822e8-firebase-adminsdk-4gijo-df37968b5b.json');

//Inicializamos el administrador de 'firebase'
admin.initializeApp({
    //Aplicamos las credenciales de autenticacion por defecto
    credential: admin.credential.cert(serviceAccount), 
    //Especificamos la URL de la base de datos 'firebase'
    //Verificar primero
    databaseURL: 'https://node-firebase-ejemplo-822e8.firebaseio.com/'
});

//De todos los servicios en 'firebase' solo usamos la base de datos
const db = admin.database();

module.exports = db;