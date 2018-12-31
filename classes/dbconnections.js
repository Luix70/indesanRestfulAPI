// MODULE THAT SETS UP THE DB ENVIRONMENT  AND SUPPLIES  FUNCTIONS
// TO WORK WITH

const mongoose = require("mongoose");
const config = require("config");
const mongoProtocol = config.get("DB_PROTOCOL") ; // Reside en Atlas
const mongoServer = config.get("DB_SERVER") ;
const mongoDB = config.get("DB_BASE") ;
const mongoUser= config.get("DB_USER");
const mongoPassword  = config.get("DB_PASS");

const mongoConectionString = `${mongoProtocol}://${mongoUser}:${mongoPassword}@${mongoServer}/${mongoDB}`;

mongoose.connect(mongoConectionString, {useNewUrlParser : true, useCreateIndex: true})
    .then(()=>{console.log("conectado a MongoDB Atlas (En la Nube). parametrizado");})
    .catch((err)=>{console.log("Algo fue mal con los parametros: \n" + err )});

const captionsSchema = new mongoose.Schema({
    es: {type: String, required: true},
    en: {type: String},
    fr: {type: String}

});


const colSchema = new mongoose.Schema({
    mod : {type: String, required : true, unique: true},
    thumbnail : {type: String, default : "Nothumb_tn"} ,
    activa:{ type: Boolean, default: true},
    captions: captionsSchema
});

const Coleccion = mongoose.model('colecciones',colSchema);



async function getColecciones(callback){
    const colecciones = await Coleccion.find();
    callback(colecciones);
}


async function getColeccion( param, callback){
   await Coleccion.find({mod:param})
   .then(resultado =>{


        if(resultado.length != 0 && !resultado[0].captions ){
            
            resultado[0].captions ={"es":"---------",
                                "fr": "----------",
                                "en": "---------"
                                }
            
        } 
        
        callback(resultado);
    
     
   })
   .catch(err =>{
        console.log(err);
   });
   
    
}

async function addColeccion(coleccion, callback){
    //console.log("Recibido por addColeccion" + coleccion);
 
    await coleccion.save()
    .then(callback)
    .catch(err =>{
        callback(new Error("Error al añadir la coleccion <br>" + err),{});
    });
}

async function deleteColeccion(nombre, callback) {
    const result= await Coleccion.deleteOne ({ mod: nombre});
    
    callback(result);                   
}


function updateColeccion(coleccion, callback) {
    //buscamos por modelo en primer lugar
    Coleccion.findOne({_id:  coleccion._id}, (err , result) =>{

        if(!result) {
            console.log(err);
            return err;
        }

        result.set({
            captions:coleccion.captions,
            mod: coleccion.mod,
            thumbnail: coleccion.thumbnail,
            activa: coleccion.activa
        })
    
        result.save();
        
        callback(result);

    });
      
}

module.exports.updateColeccion = updateColeccion;
module.exports.deleteColeccion = deleteColeccion;
module.exports.addColeccion = addColeccion;
module.exports.getColeccion = getColeccion;
module.exports.getColecciones = getColecciones;
module.exports.Coleccion = Coleccion;
