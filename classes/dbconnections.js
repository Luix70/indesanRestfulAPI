// MODULE THAT SETS UP THE DB ENVIRONMENT  AND SUPPLIES  FUNCTINOS
// TO WORK WITH

const mongoose = require("mongoose");
const mongoProtocol = process.env.DB_PROTOCOL ; // Reside en Atlas
const mongoServer = process.env.DB_SERVER;
const mongoDB = process.env.DB_BASE ;
const mongoUser= process.env.DB_USER;
const mongoPassword  = process.env.DB_PASS;

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


    


async function putColeccion(coleccion, callback){
    await coleccion.save()
    .then(callback)
    .catch(err =>{
        res.send("la coleccion que estas intentando agregar ya existe: <br>" + err)
    });
}
module.exports.putColeccion = putColeccion;
module.exports.getColeccion = getColeccion;
module.exports.getColecciones = getColecciones;
module.exports.Coleccion = Coleccion;
