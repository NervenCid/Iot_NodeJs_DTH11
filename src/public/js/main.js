//Defeinimos la direccion del servidor
//VERIFICAR PRIMERO
const host = 'http://192.168.1.106:3000';
//const host = 'http://54.190.82.243:3000';

//Almacenamos el dato proveniente del servidor
let sensorStatus = 0;

//Creamos una conexion socket con el servidor
//VERIFICAR la direccion EL SERVIDOR DEL API DE DESTINO Primero
const connection = io(host);

//Ejecutamos tan pronto se cargue la ventana
window.onload = function(){   

    //Identificador de dispositivo
    let deviceId= document.getElementById('deviceId').innerHTML;
    
    //connection.emit('Prueba', 'Hello server from client');

    //Escichamos el evento 'connect' para verificar la conexion con el servidor
    //Mostramos en consola si todo ha salido bien
    connection.on('connect', function(){
        console.log('Enlazado con el servidor: ', host); 
    });

    //Recibimos del servidor del valor por medio de websockets
    connection.on(deviceId + '/temperature', function(data){

        //console.log('temperature: ', data);

        //Cambiamos el valor de la grafica
        updateGaugeTemperature(data);
   
    });

    //Recibimos del servidor del valor por medio de websockets
    connection.on(deviceId + '/humidity', function(data){

        //console.log('humidity: ', data);

        //Cambiamos el valor de la grafica
        updateGaugeHumidity(data);
   
    });

    //Recibimos del servidor del valor por medio de websockets
    connection.on(deviceId + '/id', function(data){

        //console.log('id: ', data);
   
    });

};