//Importamos la app
const app = require('./app');

//Importamos el gestor de 'sockets'
const socketManager = require('./lib/socketManager');

//Importamos el gestor de conexiones 'mqtt'
const mqttManager = require('./lib/mqttManager');

//Esta funcion ejecuta el servidor
async function main(){

    //Obtenemos el puerto
    const PORT = app.get('port');

    //Creamos el servidor
    const server = await app.listen(PORT, '0.0.0.0');

    //Mostramos por consola
    console.log('Servidor principal ejecutandose en el puerto: ', PORT);

    //Habilitamos los websockets en el 'server'
    await socketManager.connect(server);

    //Conectamos al servidor 'mqtt'
    //await mqttManager.connect('mqtt://192.168.1.106');
    await mqttManager.connect('mqtt://54.190.82.243');

    //Importamos la conexion del servidor websockets: solo pruebas
    //const connectionSocket = require('./helpers/socketManager').connection();

    //Enviamos un dato por Socket: Solo pruebas
    //connectionSocket.sendEvent('test', 'Hola Websocket');

    //Importamos la conexion del servidor mqtt: solo pruebas
    //const connectionMqtt = require('./helpers/mqttManager').connection();

    //Enviamos un dato por MQTT: Solo pruebas
    //connectionMqtt.sendMQTT('test', 'Hola MQTT');

    //Recibimos un dato: Solo pruebas (Revisar si hay posibilidad de no usar 'callbacks')
    //connectionMqtt.registerMQTT('test', (d)=>{console.log('Data received: ', d)});
    
    //Mostramos por consola
    console.log('Servidor enlazado con webscokets');

};

//Iniciamos el servidor
main();