/*
 * Modulo que contiene la funcionalidad de enrutamiento de express
 * para la aplicacion IndesanWeb
 * así como las funciones de base de datos
 *  
 */

const express=require("express");
const router = express.Router();
const db = require("../classes/dbconnections.js");
const fs = require("fs");

router.use(express.json());
router.use(express.static("./static"));


const plantilla = `<div class="bigthumb">
                   <img src="/thumbs/:imagen:" alt=":titulo:">
                   <h1 class="__titulo">:saludo:</h1>
                   </div>
                   <h3>Español</h3>
                   <span>:es_caption:</span>
                   <h3>Francés</h3>
                   <span>:fr_caption:</span>
                   <h3>Inglés</h3>
                   <span>:en_caption:</span>`

// FUNCIONES AUXILIARES

function saludar(idioma){
    switch (idioma) {
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
};

function devolverForm(req,res){
    fs.readFile("./buscar.html",(err, data)=>{
        if(err){
         return  res.status(400).send("buscar.html no encontrado");
        }
        var textDat = data.toString();
        //console.log(textDat);
        res.send(textDat.replace(":endpoint:","http://" + req.headers.host + "/"));
    });
    
}



//RUTAS

router.get("/",(req,res)=>{
 
    db.getColecciones((colecciones)=>{
        res.json(colecciones);
    });
    
})



router.get("/buscar", devolverForm);
router.get("/buscar.html", devolverForm);

router.get("/:lan/:coleccion",(req,res)=>{

        //obtenemos los parámetros 
        var modelo =  req.params.coleccion.toLowerCase();
       
        //consultamos la BD por el modelo requerido
        db.getColeccion(modelo , (resultado) =>{
            //console.log(resultado);
            if (resultado.length == 0){

                res.status(404).send("<h1>No encontrado / pas trouvé / not found / nicht gefunden </h1> ");
                //res.status(404).json(dir);
    
            } else {
                
                var saludo = Saludar(req.params.lan.toLowerCase());
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



    const modelo = req.params.modelo.toLowerCase();
    const img = req.body.imagen;
    const es_caption = req.body.es_caption || "----------";
    const fr_caption = req.body.fr_caption || "----------";
    const en_caption = req.body.en_caption || "----------";
    const coleccion = new db.Coleccion({
        mod: modelo,
        thumbnail : img,
        captions: { es: es_caption, fr: fr_caption, en: en_caption}
    });

    db.putColeccion(coleccion, result =>{
        //console.log(result);
        res.send(plantilla.replace(":saludo:", "Añadido: "  + result.mod).
        replace(":imagen:" , result.thumbnail).
        replace(":titulo:", result.thumbnail).
        replace(":es_caption:",result.captions.es).
        replace(":fr_caption:",result.captions.fr).
        replace(":en_caption:",result.captions.en));})
   

});   

router.put("/:modelo",(req,res) =>{
    //si el modelo no existe devolver 404

    //si existe, actualizarlo y devolver el objeto actualizado

});


router.delete("/:modelo",(req,res) =>{
    //si el modelo no existe devolver 404


    //si existe, borrarlo y devolver el objeto actualizado
});

module.exports = router