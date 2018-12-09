/*
 * Modulo que contiene la funcionalidad de enrutamiento de express
 * para la aplicacion IndesanWeb
 * así como las funciones de base de datos
 *  
 */

const express=require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.use(express.json());
router.use(express.static("./static"));

//TODO: CAMBIAR ESTOS PARAMETROS POR VARIABLES DE ENTORNO

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


const plantilla = `<h1>:saludo:</h1>
                   <img src="/thumbs/:imagen:" alt=":titulo:">
                   <h3>Español</h3>
                   <span>:es_caption:</span>
                   <h3>Francés</h3>
                   <span>:fr_caption:</span>
                   <h3>Inglés</h3>
                   <span>:en_caption:</span>
                   `




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

router.get("/",(req,res)=>{
 
    getColecciones((colecciones)=>{
        res.json(colecciones);
    });
    
})

router.get("/:lan/:coleccion",(req,res)=>{



        //obtenemos los parámetros 
        var modelo =  req.params.coleccion.toLowerCase();
        var saludo="";

        //consultamos la BD por el modelo requerido

        getColeccion(modelo , (resultado) =>{

            //console.log(resultado);

            if (resultado.length == 0){

                res.status(404).send("<h1>No encontrado / pas trouvé / not found / nicht gefunden </h1> ");

                //res.status(404).json(dir);
    
            } else {
    
                switch (req.params.lan.toLowerCase()) {
                    case "fr":  
                            saludo= "Bonjour, ";
                        break;
    
                    case "es":
                            saludo= "Hola, ";
                        break;
    
                    case "en":
                            saludo= "Hello, ";
                        break;
                    default:
                            saludo= "No hablo tu idioma, ";
                }
                //console.log(resultado[0]);
                res.send(
                    plantilla.replace(":saludo:", saludo + modelo).
                            replace(":imagen:" , resultado[0].thumbnail).
                            replace(":titulo:",resultado[0].thumbnail).
                            replace(":es_caption:",resultado[0].captions.es).
                            replace(":fr_caption:",resultado[0].captions.fr).
                            replace(":en_caption:",resultado[0].captions.en)
                ); 
            } 
        })
});

router.post("/:modelo",(req,res) =>{

    async function crearColeccion(){

        const modelo = req.params.modelo.toLowerCase();
        const img = req.body.imagen;
        const es_caption = req.body.es_caption || "----------";
        const fr_caption = req.body.fr_caption || "----------";
        const en_caption = req.body.en_caption || "----------";
        const coleccion = new Coleccion({
            mod: modelo,
            thumbnail : img,
            captions: { es: es_caption, fr: fr_caption, en: en_caption}
        });

        await coleccion.save()
        .then(result =>{
            //console.log(result);
            res.send(plantilla.replace(":saludo:", "Añadido: "  + result.mod).
            replace(":imagen:" , result.thumbnail).
            replace(":titulo:", result.thumbnail).
            replace(":es_caption:",result.captions.es).
            replace(":fr_caption:",result.captions.fr).
            replace(":en_caption:",result.captions.en));
        })
        .catch(err =>{
            res.send("la coleccion que estas intentando agregar ya existe: <br>" + err)
        });

        
    };

    crearColeccion();   
   

});   

module.exports = router