//utilidad que examina el directorio especificado e inserta las imagenes
//en la base de datos. No tiene utilidad orgánica dentro de la API

var fs = require("fs");

const db = require("./classes/dbconnections");

var colPath = "../web/resources/images/Colecciones/";

var contenido = fs.readdirSync(colPath);
for (var i=0; i<contenido.length; i++) {
    var file = colPath + contenido[i];

    var filestats=fs.statSync(file);
    if (filestats.isDirectory()) {
        console.log ("*****************************************");
        console.log(contenido[i]);
        console.log ("*****************************************");
        var archivos= fs.readdirSync(file);
        for (var j=0; j<archivos.length;j++) {
            if( archivos[j].match(/^tn_/g)){

                crearImagenDb(archivos[j], contenido[i]);
                
            } ;
        }
}
  
 }

 async function crearImagenDb(nombreArchivo, nombreColeccion){
        //console.log(nombreArchivo + " || " + nombreArchivo.replace("tn_" , "").replace(".jpg" , ".tif") + " || " + nombreArchivo.replace("tn_" , "") + " --> " +nombreColeccion)
        
        //sabemos ue nombreArchivoes correcto, pero puede haber divergencias 
        var fileJPGtmp = nombreArchivo.replace("tn_" , "").replace(/\(/g,"[(]").replace(/\)/g,"[)]");
        var fileJPG="*********";
        var fileTIFtmp= fileJPGtmp.replace(/.jpg/i,".tif");
        var fileTIF ="*********";

        //leemos el contenido del directorio otra vez y buscamos si hay una coincidencia case insensitive
        var archivos = fs.readdirSync(colPath + nombreColeccion + "/");
        for(var i=0;i< archivos.length;i++){
            var regex = new RegExp("^" + fileJPGtmp, "i");
            var regex2 = new RegExp("^" + fileTIFtmp,"i");
            if (archivos[i].match(regex)) fileJPG = archivos[i];
            if (archivos[i].match(regex2)) fileTIF = archivos[i];
        }

        
        console.log(nombreArchivo + " || " + fileJPGtmp +  " || " + fileJPG + " || " + fileTIF );

        var docImage={
            nombre_tn :nombreArchivo,
            nombre_img : fileJPG,
            nombre_img_hr:fileTIF,
            folder:nombreColeccion,
            colecciones:[nombreColeccion],
            modelos:[{cod_modelo : "SM"}],
            pieFoto: {es: fileJPG + ". Coleccion: " + nombreColeccion,
                      fr: fileJPG + ". Collection: " + nombreColeccion,
                      en: fileJPG + ". Collection: " + nombreColeccion},
            instrucciones:"...",
            tecnico:"...",
            video:"..."
        }

        var image = new db.Imagen(docImage);
        await image.save().then(()=>{console.log("Guardado " + nombreArchivo)});


        
 }
