//Este modulo sirve para autenticar al usuario cada vez que ingrese

//Importamos el modulo 'path' para poder manipular las rutas de sistema
const path = require('path');

//Importamos las librerias
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Llamamos el modelo de la base de datos dentro de 'UserDB.js'
const User=require(path.join(__dirname, '..', 'models', process.env.DATABASE_MODE, 'UserDB'));

//Definimos la estrategia de autenticacion (usando el 'email')
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    //Consultamos la base de datos el usuario (email)
    const user = await User.findOne({email: email});
    if(!user){
        //Retornamos un callback
        //null: No hay error
        //false: Quiere decir que no hay usuario
        return done(null, false, {massage: 'Usuario no encontrado.'});
    } else {
        //Comparamos el password
        const match = await user.matchPassword(password);
        if(match){
            return done(null, user);
        }else{
            //Retornamos un callback
            //null: No hay error
            //false: Quiere decir el password es incorrecto
            return done(null, false, {message: 'Password Incorrecto'});
        }
    }
}));

//Almacenamos el usuario dentro de una session
//Esto con el proposito de no hacer que el usuario 
//haga login cada vez que cambia de pagina
passport.serializeUser((user, done) => {
    //Almacenamos la 'id'
    done(null, user.id);
});

//Una vez obtenida la 'id' hacemos una consulta en la base de datos
//que nos devuelve toda la informacion relacionada con dicha 'id' de usuario
//y un error
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});