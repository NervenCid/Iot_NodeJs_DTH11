//Creamos una conexion vacia
let connection = null;

//Con esta clase gestionamos la conexion de los Socket
class mqttManager{

    //Declaramos el constructor
    constructor(){

        //Declaramos un socket con  un valor inicial nulo
        this._client = null;
    }

    //Conectamos, y pasamos como parametro un 'server' mqtt
    connect(serverUrl){

        console.log('Conectando al servidor MQTT: ', serverUrl);

        //Importamos 'mqtt'
        var mqtt = require('mqtt')

        //Creamos un cliente para la conexion 
        var client  = mqtt.connect(serverUrl);

        //Asignamos el valor de 'client' a 'this._client' 
        this._client= client;

        //Escuchamos el evento 'connection' 
        this._client.on('connect', function () {
            //Mostramos por consola
            console.log('Conexion exitosa con el servidor mqtt: ', serverUrl);
        });

        //Escuchamos el evento 'disconnect' 
        this._client.on('disconnect', function () {
            //Mostramos por consola
            console.log('Desconectado del servidor mqtt: ', serverUrl);
        });

        //Escuchamos el evento 'error' 
        this._client.on('error' , function(){
            //Mostramos por consola
            console.log('Error de conexion al servidor mqtt: ', serverUrl);
        });      

        //Prueba en bruto para la recepcion de mensajes
        /*
        this._client.subscribe('test');

        this._client.on('message', function(topic, message){
            console.log('Prueba: ', message.toString());
        });

        */

    };

    //--------------------METODOS---------------------------
 
    //Nos subscribimos a un 'topic'
    //Por ahora este metodo no hace nada
    //Solo recibe un 'topic' y un evento MQTT que puede ser publish o register
    subscribeMQTT(topic){

        //Nos subscribimos a 'topic'
        this._client.subscribe(topic, function(){
            console.log('Suscrito a:', topic);
        });

    };

    //Enviamos un dato
    sendMQTT(topic, data){

        //Publicamos 'data' en 'topic'
        this._client.publish(topic, data);

    };

    //Registramos o recibimos un dato
    //Se necesita una funcion 'handler' que funcionara de 'callback'
    //Para llmarlo externamente
    registerMQTT(topic, handler){

        //Nos suscribimos al 'topic'
        this.subscribeMQTT(topic);

        //Escuchamos el evento 'message' y disparamos el 'handler'
        //El handler DEBE ser una funcion que se ejecutara dentro del 'callback'
        this._client.on('message', function(topic, message){
            
            //Convertimos a 'string'
            let data= message.toString();

            //Mostramos por consola
            //console.log(`Received: \n \xa0 data: ${data}`);  

            handler(data);
        
        });
        
    }   
   
    //-----------METODOS ESTATICOS (No requieren instanciar la clase)---------
    static init(server){
        
        console.log('Iniciando el cliente MQTT');

        //Si no existe una conexion iniciamos una entidad nueva y conectamos
        if(!connection){

            console.log('¡La conexion a servidor MQTT no existe!, iniciando una nueva conexion');

            connection = new mqttManager();
            connection.connect(server);

            //console.log('Nueva conexion MQTT: ', connection);
        
        }
    };

    //Obtenemos una conexion
    static getConnection(){

        //console.log('Obteniendo la conexion MQTT: ', connection);

        //Verificamos si hay una conexion activa
        if(!connection){

            //Si no hay una conexion activa arrojamos un error
            throw new Error("No hay conexiones a servidor MQTT activas");
  
        }
  
        //Devolvemos la conexion en caso de existir
        return connection;
    };

};

//Exportamos el modulo
module.exports = {

    //Inicializar el servidor
    connect: mqttManager.init,
    //Obtener la conexion
    connection: mqttManager.getConnection,
  
}