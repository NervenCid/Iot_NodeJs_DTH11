//Aqui configuramos la conexion con la base de datos

//Importamos las librerias
const mongoose = require('mongoose');

/*Conectamos y copnfiguramos:
En este caso nos conectamos a 'localhost' y conectamos a la base de datos 'proyecto-final-bictia'
en caso de que esta base de datos no exista, mongo la creara automaticamente,
al final ejecutamos una promesa y una excepcion en caso de error
*/

//Conexion local

/*

mongoose.connect('mongodb://localhost/proyecto-final-bictia', {


    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(db=>console.log('La base de datos esta conectada'))
    .catch(err=>console.error(err));

*/



mongoose.connect('mongodb+srv://diego:admin@pycom-node-lfsc1.mongodb.net/test?retryWrites=true&w=majority', {


    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(db=>console.log('La base de datos esta conectada'))
    .catch(err=>console.error(err));

