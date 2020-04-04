//Creamos una conexion vacia
let connection = null;

//Con esta clase gestionamos la conexion de los Socket
class socketManager{

  //Declaramos el constructor
  constructor(){

    //Declaramos un socket con  un valor inicial nulo
    this._socket = null;

    //Declaramos
    this._io=null;
    
  }

  //Conectamos, y pasamos como parametro un 'server'
  connect(server){

    console.log('Conectando el servidor de WebSockets');
    
    //Importamos 'socket.io' y creamos el objeto 'io' con el 'server'
    this._io = require('socket.io')(server);

    //Escuchamos el evento 'connection' 
    this._io.on('connection', (socket)=>{
      
      //Asignamos el valor de 'socket' a 'this._socket' 
      this._socket = socket;

      //Verificamos el estado de conexion
      this._socket.on('statusConnection', (data)=>{

        //Mostramos por consola
        console.log('statusConnection: ', data);

      });

      //Escuchamos el evento de desconexion
      this._socket.on('disconnect', function(){

        //Mostramos por consola
        console.log(`El socket con id: ${socket.id} , se ha desconectado`);

      });
      
      //Mostramos por consola si hay una nueva conexion
      console.log(`¡Nuevo socket creado!, asignado el id: ${socket.id}`);

      //this._socket.on('Prueba', function(d){console.log('Escucha exitosa')});

    });

    //Escuchamos el evento 'connect'
    this._io.on('connect', (socket)=>{

      //Asignamos el valor de 'socket' a 'this._socket' 
      this._socket = socket;
      
      console.log('Conexion de websockets detectada con el id:', socket.id);
      
    });

    //Escuchamos el evento 'Error'
    this._io.on('error', function(error){
      
      //Mostramos el error por consolas
      console.log('Error de conexion:', error);

    })

  }

  //----------------------------METODOS------------------------------------

  //Enviar evento
  sendEvent(event, data){

    //Diagnostico por consola
    //console.log(`Diagnostico de 'sendEvent': \n Valor de 'event': ${event} \n Valor de 'data': ${data}`);

    //Emitimos siempre y cuando exista un socket
    if(!this._socket){
      
      //En caso de no existir
      console.log('¡No hay clientes conectados, ni Sockets utilizables para enviar datos!');

    }else{

      //Diagnostico por consola
      //console.log(`Enviando  por el socket con id: ${this._socket.id} \n evento: ${event} \n data: ${data} \n socket id: ${this._socket.id}`);

      //En caso de existir un Socket utilizables
      this._socket.emit(event, data);

    }
    
  }

  //Registrar (o recibir) un evento
  registerEvent(event, handler){

    //Verificamos que existe el objeto 'io'
    if(!this._io){

      console.log('¡El obejto "io" No Existe!, reintente la conexion con el cliente');

    }
    else{

      console.log('¡"io" Existe!, procediendo con la recepcion');

      //Escuchamoes el evento 'connect'
      this._io.on('connect', (socket)=>{

        //console.log('Escuchando en el socket con id:', this._socket.id);
        //Escuchamos 'event' y ejecutamos el 'handler'
        socket.on(event, handler);

    });     

    };
    
  };

  //-----------METODOS ESTATICOS (No requieren instanciar la clase)---------

  //Iniciamos el servidor
  static init(server){

    console.log('Iniciando el servidor de websockets');

    //Si no existe una conexion iniciamos una entidad nueva y conectamos
    if(!connection){

      console.log('¡La conexion de websockets no existe!, iniciando una nueva conexion: ');

      connection = new socketManager();
      connection.connect(server);

      //console.log('Nueva conexion websocket: ', connection);
      
    }

  };  

  //Obtenemos una conexion
  static getConnection(){

    console.log('Obteniendo la conexion a websockets');

    //Verificamos si hay una conexion activa
    if(!connection){

      //Si no hay una conexion activa arrojamos un error
      throw new Error("No hay conexiones websockets activas");

    }

    //Devolvemos la conexion en caso de existir
    return connection;

  };

};

//Exportamos el modulo
module.exports = {

  //Inicializar el servidor
  connect: socketManager.init,
  //Obtener la conexion
  connection: socketManager.getConnection

}