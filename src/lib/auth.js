//Exportamos el modulo
module.exports={

    //Verificamos si el usuario esta logeado
    isLoggedIn(req, res, next){
        if(req.isAuthenticated()){
            //Si el usuario esta logeado continuamos ejecutando el codigo de las rutas
            return next();
        }
        //Caso contrario lo redirigimos al signin
        return  res.redirect('/users/signin');
    },
    //Para evitar el signin cuando el usuario ya esta autenticado
    isNotloggedin(req, res, next){
        if(!req.isAuthenticated()){
            return next();
        }
        return  res.redirect('/profile');
    }

};