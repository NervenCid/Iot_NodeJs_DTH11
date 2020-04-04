//Aqui vamos a modificar las fechas recibidas
//Importamos la libreria

const {format}=require ('timeago.js');

//Tomamos la fecha de la base de datos, la formateamos y la devolvemos
const helpers={};

helpers.timeago=(timestamp)=>{
    return format(timestamp);
}

//Exportamos el modulo
module.exports=helpers;