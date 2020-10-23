/* Modulo que contiene la funcionalidad de enrutamiento de express
 * para la aplicacion IndesanWeb */

const express=require("express");
const router = express.Router();
const db = require("../classes/dbconnections.js");
const fs = require("fs");
const fileUpload = require('express-fileupload')

router.use(fileUpload());

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
        //req.protocol: http or https
        //req.headers.host: localhost:2001, por ejemplo
        res.send(textDat.replace(/:endpoint:/g, req.protocol + "://" + req.headers.host + "/"));
    });
    
}

function mergePlantilla(result , texto){
    //console.log("merge plantilla result " + result);
    return plantilla.replace(":saludo:",texto).
            replace(/:imagen:/g , result.thumbnail).
            replace(/:titulo:/g, result.thumbnail).
            replace(":activa:", (result.activa ? "checked" :null )).
            replace(":_id:",result._id,).
            replace(":es_caption:",result.captions.es ).
            replace(":fr_caption:",result.captions.fr).
            replace(":en_caption:",result.captions.en).
            replace(":es_desc:", result.desc ? result.desc.es : "es_desc" ).
            replace(":fr_desc:", result.desc ? result.desc.fr : "fr_desc" ).
            replace(":en_desc:", result.desc ? result.desc.en : "en_desc");
            
}

//RUTAS

router.get("/",(req,res)=>{
 
    db.getColecciones((colecciones)=>{
        res.json(colecciones);
    });
    
})


router.get("/web",(req,res)=>{
 
    db.getColeccionesActivas((colecciones)=>{
        res.json(colecciones);
    });
    
})

router.get("/buscar",  devolverForm);
router.get("/buscar.html", devolverForm);

router.get("/:lan/:coleccion",(req,res)=>{

        //obtenemos los parámetros 
        var modelo =  req.params.coleccion.toLowerCase();
       
        //consultamos la BD por el modelo requerido
        db.getColeccion(modelo , (resultado) =>{
            
            if (resultado.length == 0){

                res.status(404).send("<h1>No encontrado / pas trouvé / not found / nicht gefunden </h1> ");
               
    
            } else {
                
                var saludo = saludar(req.params.lan.toLowerCase());
               
                res.send( 

                    mergePlantilla(resultado[0] , saludo + modelo )
                  
                ); 
            } 
        })
});


function recuperarColeccion(req){
    const mod = req.body.mod.toLowerCase();
    const thumbnail = req.body.thumbnail;
    const _id = req.body._id;
    const activa = req.body.activa || false;
    const es_caption = req.body.es_caption || "es_caption";
    const es_desc = req.body.es_desc || "es_desc";
    const fr_caption = req.body.fr_caption || "fr_caption";
    const fr_desc = req.body.fr_desc || "fr_desc";
    const en_caption = req.body.en_caption || "en_caption";
    const en_desc = req.body.en_desc || "en_desc";
    const coleccion = new db.Coleccion({
        mod: mod,
        thumbnail : thumbnail,
        activa: activa,
        captions: { es: es_caption, fr: fr_caption, en: en_caption},
        desc:{ es: es_desc , fr: fr_desc, en : en_desc }
    });
    if (_id !="?") {
        coleccion._id=_id;
        }
    
    return coleccion;
}
router.post("/save",(req,res) =>{

    const coleccion = recuperarColeccion(req);
 

    db.addColeccion(coleccion, result =>{
 
        res.send( mergePlantilla(result, "Añadido: "  + result.mod) );
    })
   

});   

router.put("/update",(req,res) =>{
    
    const coleccion = recuperarColeccion(req);

    
    
  
    db.updateColeccion(coleccion, result =>{

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

router.post("/upload",function(req, res){

    console.log(req.files)
    let uploadFile = req.files.filepond
    const fileName = req.files.filepond.name
    console.log( `${__dirname}/../static/thumbs/${fileName}`);
    uploadFile.mv(
         `${__dirname}/../static/thumbs/${fileName}`,
         function (err) {
         if (err) {
            console.log(err); 
            return res.status(500).send(err)
          }
    
          res.json({
            file: `../thumbs/${req.files.filepond.name}`,
          })
        }
      )
});

module.exports = router