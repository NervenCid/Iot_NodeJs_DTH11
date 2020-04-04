//Renderizamos la pagina principal
const getIndex = async (req, res)=>{

    //Renderizamos el index
    res.render("index");

};

//Exportamos los controladores
module.exports = {
    getIndex,    
}