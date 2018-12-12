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
    activa:{ type: Boolean, default:true},
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
    await coleccion.save()
    .then(callback)
    .catch(err =>{
        res.send("la coleccion que estas intentando agregar ya existe: <br>" + err)
    });
}

async function deleteColeccion(nombre, callback) {
    const result= await Coleccion.deleteOne ({ mod: nombre});
    //console.log(JSON.stringify(result))
    callback(result);                   
}


function updateColeccion(coleccion, callback) {
    //buscamos por modelo en primer lugar
    Coleccion.findOne({_id: "ObjectId(" + coleccion._id + ")"}, (err , result) =>{
        console.log(result);
        if(!result) {
            return console.log("error localizando " + coleccion._id + " " + err);
        }

        result.set({
            captions:coleccion.captions,
            mod: colleccion.mod,
            thumbnail: coleccion.thumbnail,
            activa: coleccion.activa
        })
    
        result.save();
        
        callback(result)

    });

      
}

module.exports.updateColeccion = updateColeccion;
module.exports.deleteColeccion = deleteColeccion;
module.exports.addColeccion = addColeccion;
module.exports.getColeccion = getColeccion;
module.exports.getColecciones = getColecciones;
module.exports.Coleccion = Coleccion;
