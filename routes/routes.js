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

// FUNCIONES AUXILIARES
fs.readFile("./views/plantillaColeccion.html",(err, data)=>{global.plantilla = data.toString()});

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
    fs.readFile("./views/buscar.html",(err, data)=>{
        if(err){
         return  res.status(400).send("buscar.html no encontrado");
        }
        var textDat = data.toString();
        //console.log(textDat);
        res.send(textDat.replace(":endpoint:","http://" + req.headers.host + "/"));
    });
    
}

function mergePlantilla(result , texto){
    return plantilla.replace(":saludo:",texto).
            replace(/:imagen:/g , result.thumbnail).
            replace(/:titulo:/g, result.thumbnail).
            replace(":_id:",result._id,).
            replace(":es_caption:",result.captions.es).
            replace(":fr_caption:",result.captions.fr).
            replace(":en_caption:",result.captions.en)
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

                    mergePlantilla(resultado[0] , saludo + modelo )
                  
                ); 
            } 
        })
});


function recuperarColeccion(req){
    const modelo = req.body.col.toLowerCase();
    const img = req.body.thumbnail;
    const _id = req.body._id;
    const es_caption = req.body.es_caption || "----------";
    const fr_caption = req.body.fr_caption || "----------";
    const en_caption = req.body.en_caption || "----------";
    const coleccion = new db.Coleccion({
        mod: modelo,
        thumbnail : img,
        captions: { es: es_caption, fr: fr_caption, en: en_caption}
    });

    return coleccion;
}
router.post("/save",(req,res) =>{

    const coleccion = recuperarColeccion(req);

    db.addColeccion(coleccion, result =>{
        //console.log(result);
        res.send( mergePlantilla(result, "Añadido: "  + result.mod) );
    })
   

});   

router.put("/update",(req,res) =>{
    
    const coleccion = recuperarColeccion(req);

    console.log(coleccion);
    db.updateColeccion(coleccion, result =>{
        //console.log(result);
        res.send(mergePlantilla(result, "Modificado: "  + result.mod));
    })
    

});


router.delete("/:modelo",(req,res) =>{
    const modelo = req.params.modelo.toLowerCase();

    db.deleteColeccion(modelo,(result)=>{
        

        if (!result.n){ //si no se ha eliminado nada el valor es 0
            //si el modelo no existe devolver 404
            var resultado = {
                thumbnail : "",
                _id:"" ,
                mod: "ERROR",
                captions:{
                    es:"No se ha encontrado la coleccion a eliminar",
                    en:"Collection not found",
                    fr: "Collection pas trouvée"
                }
            }
            return res.status(404).send(mergePlantilla(resultado ,  "NO EXISTE: "  + modelo))

        } else {
            //si existe, confirmar que se ha borrado
            var resultado = {
                thumbnail : "",
                _id:"" ,
                mod: "ELIMINADO",
                captions:{
                    es:"Coleccion Borrada",
                    en:"Deleted Collection",
                    fr:"Collection effacée"
                }
            }
            res.send(mergePlantilla(resultado , "ELIMINADO : "  + modelo));

        }
        
    });
});

module.exports = router