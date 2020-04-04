//Importamos el modulo 'path' para poder manipular las rutas de sistema
const path = require('path');

//Importamos el modulo de webtokens
//Un 'JSON web token' o 'JWT' es un arreglo de caracteres que sirve para 
//contener las credenciales de acceso y cumple una funcion similar a un password
const jwt = require('jsonwebtoken');

//Importamos la configuracion del secret del 'token'
const config =require('../../lib/tokenConf');

//Importamos los modelos
const Device=require(path.join(__dirname, '..', '..', 'models', process.env.DATABASE_MODE, 'DeviceDB'));

//--------------------------------Accion: Obtener todos los dispositivos-----------------------------------

//Renderizamos el todos los dispositivos registrados
const getDevices = async(req,res)=>{

    /*Realizamos una busqueda dentro de la base de datos, si le pasamos 
    parametros a 'find' podremos encontrar cosas mas especificas, 
    con '.find({user: req.user.id})' solo traemos los dispositivos creadas por el usuario
    que esta logeado, y asociadas a su cuenta, y
    con '.sort({date: 'desc'})', ordenamos de forma descendente*/
    const devices = await Device.find({userOwnerId: req.user.id}).sort({ date: "desc" }).lean();

    //Renderizamos
    res.render('devices/all-devices', {devices});

}

//-----------------------------------Accion: Crear un nuevo dispositivo------------------------------------

//Renderizamos el formulario de crear nuevo dispositivo

//Renderizamos el formulario de 'signin'
const getAddDevice = async(req,res)=>{

    //Renderizamos
    res.render('devices/new-device');

}

//Creamos el dispositivo
const AddDevice = async(req,res)=>{

    //Recibimos los datos introducidos por el usuario en el formulario
    const { deviceName } = req.body; 

    //Recibimos los errores en un arreglo
    const errors = [];
    if (!deviceName) {
        errors.push({ text: 'Se requiere un nombre de dispositivo' });
    }
    if (errors.length > 0) {
      res.render("devices/new-device", {
        errors,
        deviceName,
      });
    } else {

        //Creamos un dispositivo nuevo
        const newDevice = new Device({ 

            //Identificadores
            deviceName: deviceName,

            //Datos de usuario
            userOwnerName: req.user.name,
            userOwnerId: req.user.id,

            //Creamos un nuevo 'token'
            //Donde enviamos un dato , en este caso 'req.user.id' al cliente
            //,usamos 'config.secret', para cifrarlo y con 'expiresIn' definimos el tiempo en 
            //segundos que durara el 'token' hasta su expiracion
            token: jwt.sign(
                {id: req.user.id},
                config.secret,
                //En este caso seria un dia
                //{expiresIn: 60*60*24}
                ),

            //Valores por defecto
            temperature: '0',
            humidity: '0',

         }); 
        
        /*Guardamos en la base de datos:
        Con la palabra 'await' indicamos que el proceso asincrono e indica al servidor 
        que cuando termine continue con el codigo posterior
        */
        await newDevice.save(); //Guardamos en la base de datos
        req.flash("success_msg", "Dispositivo Registrado"); //Mostramos el mensaje de flash (ver el archivo messaages.hbs)
        res.redirect("/devices");
        //res.send("Recibido");
        }; //Si hay errores renderizamos la vista con los errores si no continuamos

    //Renderizamos
    //res.render('devices/all-devices');

}

//-----------------------------------Accion: Editar un nuevo dispositivo------------------------------------

//Renderizamos el formulario de edicion
const getEditDevice = async(req,res)=>{

    //Recibimos la nota por el 'id'
    const device = await Device.findById(req.params.id);
    res.render('devices/edit-device', { device });

}

//Editamos el dispositivo
const editDevice = async(req,res)=>{
    
    //Obtenemos las propiedades del formulario
    const { title, description } = req.body;
    //Buscamos por 'id' y luego la actualizamos
    await Device.findByIdAndUpdate(req.params.id, { title, description });
    req.flash("success_msg", "Parametros de dispositivo Modificados");//Mostramos el mensaje con flash (ver el archivo messaages.hbs)
    //Redireccionamos
    res.redirect('/devices');

}

//-------------------------------------Accion: Eliminar un dispositivo--------------------------------------

//Eliminamos el dispositivo
const deleteDevice = async(req,res)=>{

    //Eliminamos de la base de datos
    await Device.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Dispositivo Eliminado"); //Con flash mostramos el mensaje en panatalla (ver el archivo messages.hbs)
    res.redirect('/devices');

}

//---------------------------------Accion: Mostrar el dispositivo en detalle--------------------------------

//Mostramos el 'dashboard' de dispositivo
const getSingleDevice= async(req,res)=>{

    /*Realizamos una busqueda dentro de la base de datos*/
    const devices = await Device.find({userOwnerId: req.user.id}).sort({ date: "desc" }).lean();

    //Importamos la conexion del servidor de Sockets
    const connectionSocket = require('../../lib/socketManager').connection();

    //Importamos la conexion del servidor mqtt
    const connectionMqtt = require('../../lib/mqttManager').connection();

    //Creamos una funcion que se ejecutara cada vez que recibimos un dato por mqtt
    //En este caso enviamos por websockets
    let sendToSocket=async (d)=>{
        
        //Conversion de los datos
        let data = JSON.parse(d.replace(/'/g,"\""));

        //console.log('Enviando al Socket: ',data.token);  
        //console.log('Enviando al Socket: ',data.temperature);  
        //console.log('Enviando al Socket: ',data.humidity); 
        
        //Verificamos el 'token'
        //Notese que dentro de 'decoded' se encuentra el 'id' del 'user'
        //al que le corresponde dicho 'id'
        await jwt.verify(data.token, config.secret, async (error, decoded) => {
            
            //Si NO existe el 'user' devolvemos un estado de error
            if(error){
                console.log('Token No valido')
                //return res.status(404).send('El TOKEN ES INCORRRECTO o hay un error de servidor');
            }else{

                //Mostramos en consola
                //console.log('decoded: ', decoded);  

                //Enviamos por el socket
                await connectionSocket.sendEvent('temperature', data.temperature);
                await connectionSocket.sendEvent('humidity', data.humidity);
                
            };     

        });

    };

    //Armamos el topic
    let user=req.user.id; 
    let device=req.params.id;
    let topic=user+'/'+device;
    console.log('topic', topic); 

    //Registramos un dato recibido por mqtt y lo enviamos al 'socket'
    connectionMqtt.registerMQTT(topic, sendToSocket);

    //Renderizamos
    res.render('devices/detail-device');

}

//----------------------------------------------------------------------------------------------------------

//Exportamos el modulo
module.exports = {
    getDevices,
    getAddDevice,
    AddDevice,
    getEditDevice,
    editDevice,
    deleteDevice,
    getSingleDevice
};


