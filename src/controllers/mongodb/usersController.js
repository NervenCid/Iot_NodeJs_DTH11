//Importamos el modulo 'path' para poder manipular las rutas de sistema
const path = require('path');

//Importamos passport para la autenticacion
const passport = require("passport");

//Importamos los modelos
const User=require(path.join(__dirname, '..', '..', 'models', process.env.DATABASE_MODE, 'UserDB'));

//----------------------------------------------signin----------------------------------------------------

//Renderizamos el formulario de 'signin'
const getSignIn = async(req,res)=>{

    //Renderizamos
    res.render('users/signin');

}

//Recibimos los datos del formulario signin y autenticamos con
//la estrategia 'local' que se definio dentro de 'passport.js'
const signIn = passport.authenticate('local', {
    successRedirect: '/devices',
    failureRedirect: '/users/signin',
    //Habiliatamos los mensajes 'flash'
    failureFlash: true
});

//----------------------------------------------signup----------------------------------------------------

//Renderizamos el formulario de 'signip'
const getSignUp = async(req,res)=>{

    //Renderizamos
    res.render('users/signup');

}

//Creamos un usuario
const signUp = async (req, res) => {

    //Capturamos los datos
    const { name, email, password, confirm_password} = req.body;
    const errors= [];
    if(name.length <=0){
                         //Agregamos el texto al arreglo de errores
                         errors.push({
                           text: "Se requiere un nombre"
                         });
                       }
    if(password != confirm_password){
        //Agregamos el texto al arreglo de errores
        errors.push({text: 'Los password no coinciden.'});
    }
    //Si hay un error renderizamos de nuevo el formulario de registro 
    //con el error en cuestion (ver archivo 'errors.hbs')
    //si no continuamos
    if(errors.length>0){
        res.render('users/signup', {errors, name, email, password, confirm_password});
    }else{
        //res.send('ok');
        //Validamos que el corredo no este repetido por otro usuario
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            console.log('email', emailUser.email);
            req.flash('error_msg', 'El email ya esta registrado');
            res.redirect('/users/signup');
        }else{
            //Guardamos en la base de datos
            const newUser = new User({name, email, password});
            newUser.password = await newUser.encryptPassword(password);
            //console.log(newUser);
            //res.send('ok');
            await newUser.save();
            req.flash('success_msg', 'Registro exitoso');
            //Redireccionamos
            res.redirect('/users/signin');
        }        
    }

}

//----------------------------------------------logout----------------------------------------------------

//Salimos de la plataforma
const logout = async (req,res) => {
    req.logout();
    res.redirect('/');
}

//--------------------------------------------------------------------------------------------------------

//Exportamos el modulo
module.exports = {
    getSignIn,
    signIn,
    getSignUp,
    signUp,
    logout
};