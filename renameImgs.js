//utilidad que examina el directorio especificado e inserta las imagenes
//en la base de datos. No tiene utilidad orgánica dentro de la API

var fs = require("fs");

const db = require("./classes/dbconnections");

var colPath = "../web/resources/images/Colecciones/";

db.getColecciones(renombrarColecciones);

function renombrarColecciones(colecciones) {
  colecciones.map(col => {
    col.thumbnail = col.thumbnail
      .replace(/ /g, "")
      .replace(/\(/g, "_")
      .replace(/\)/g, "_");
    col.save();
    db.getImagenesColeccion(col.mod, renombrar);
    console.log("renombrada la coleccion " + col.mod);
  });
  console.log("hecho");
}

function renombrar(imagenes) {
  imagenes.map(img => {
    img.nombre_tn = img.nombre_tn
      .replace(/ /g, "")
      .replace(/\(/g, "_")
      .replace(/\)/g, "_");

    img.nombre_img = img.nombre_img
      .replace(/ /g, "")
      .replace(/\(/g, "_")
      .replace(/\)/g, "_");

    img.nombre_img_hr = img.nombre_img_hr
      .replace(/ /g, "")
      .replace(/\(/g, "_")
      .replace(/\)/g, "_");
    img.save();
  });
  console.log("hecho");
}
