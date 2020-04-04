//Importamos la libreria 'express'
const express = require('express');
const router = express.Router();

//Importamos los controladores
const {getIndex} = require('../controllers/mongodb/mainPageController');

//Ruta principal NO LOGIN
router.get('/', getIndex);

//Ruta 'acerca de' o 'about'
router.get('/about', (req, res) => {

    //res.send('Soy el puto About');
    res.render("about");

});

//Exportamos el modulo
module.exports = router;
