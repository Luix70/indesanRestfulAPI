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


const plantilla = `<div class="thumbContainer">
                   <img class="thumb" src="/thumbs/:imagen:" alt=":titulo:">
                   <span id="nombreImagen" class="invisible">:imagen:</span>
                   <span id="_id" class="invisible">:_id:</span>
                   <h1 class="__titulo">:saludo:</h1>
                   </div>
                   <div class="subtitulos">
                    <span class="lang_cap">Español: </span>
                    <input type="text" id="es_cap" value=":es_caption:" class="lang_text">
                    <span class="lang_cap">Francés: </span>
                    <input type="text" id="fr_cap" value=":fr_caption:" class="lang_text">
                    <span class="lang_cap">Inglés: </span>
                    <input type="text" id="en_cap" value=":en_caption:" class="lang_text">
                   </div>` 
// FUNCIONES AUXILIARES

function saludar(idioma){
    var saludo= "No hablo tu idioma, ";
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
    }

    return saludo;
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
                
                var saludo = saludar(req.params.lan.toLowerCase());
                //console.log(resultado[0]);
                res.send(
                    plantilla.replace(":saludo:", saludo + modelo).
                            replace(/:imagen:/g , resultado[0].thumbnail).
                            replace(/:titulo:/g,resultado[0].thumbnail,).
                            replace(":_id:",resultado[0]._id,).
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

    db.addColeccion(coleccion, result =>{
        //console.log(result);
        res.send(plantilla.replace(":saludo:", "Añadido: "  + result.mod).
        replace(/:imagen:/g , result.thumbnail).
        replace(/:titulo:/g, result.thumbnail).
        replace(":_id:",resultado[0]._id,).
        replace(":es_caption:",result.captions.es).
        replace(":fr_caption:",result.captions.fr).
        replace(":en_caption:",result.captions.en));})
   

});   

router.put("/:modelo",(req,res) =>{
    
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

    db.updateColeccion(coleccion, result =>{
        //console.log(result);
        res.send(plantilla.replace(":saludo:", "Modificado: "  + result.mod).
        replace(":imagen:" , result.thumbnail).
        replace(":titulo:", result.thumbnail).
        replace(":es_caption:",result.captions.es).
        replace(":fr_caption:",result.captions.fr).
        replace(":en_caption:",result.captions.en));})
    

});


router.delete("/:modelo",(req,res) =>{
    const modelo = req.params.modelo.toLowerCase();

    db.deleteColeccion(modelo,(result)=>{
        

        if (!result.n){ //si no se ha eliminado nada el valor es 0
            //si el modelo no existe devolver 404
            return res.status(404).send(plantilla.replace(":saludo:", "NO EXISTE: "  + modelo).
            replace(":imagen:" , "").
            replace(":titulo:", "ERROR").
            replace(":es_caption:","No se ha encontrado la coleccion a eliminar").
            replace(":fr_caption:","Collection pas trouvée").
            replace(":en_caption:","Collection not found"))
        } else {
            //si existe, confirmar que se ha borrado
            res.send(plantilla.replace(":saludo:", "ELIMINADO : "  + modelo).
            replace(":imagen:" , "").
            replace(":titulo:", "eliminado").
            replace(":es_caption:","Coleccion Borrada").
            replace(":fr_caption:","Collection effacée").
            replace(":en_caption:","Deleted Collection"));

        }
        
    });
});

module.exports = router