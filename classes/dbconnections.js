// MODULE THAT SETS UP THE DB ENVIRONMENT  AND SUPPLIES  FUNCTIONS
// TO WORK WITH

const mongoose = require("mongoose");
const config = require("config");
const col = require("../models/coleccion.js");
const img = require("../models/imagen.js");
const mongoProtocol = config.get("DB_PROTOCOL"); // Reside en Atlas
const mongoServer = config.get("DB_SERVER");
const mongoDB = config.get("DB_BASE");
const mongoUser = config.get("DB_USER");
const mongoPassword = config.get("DB_PASS");

const mongoConectionString = `${mongoProtocol}://${mongoUser}:${mongoPassword}@${mongoServer}/${mongoDB}`;

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

mongoose
  .connect(mongoConectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("conectado a MongoDB Atlas (En la Nube). parametrizado");
  })
  .catch((err) => {
    console.log("Algo fue mal con los parametros: \n" + err);
  });

async function getColecciones(callback) {
  const colecciones = await col.Coleccion.find();
  callback(colecciones);
}

async function getColeccionesActivas(callback) {
  const colecciones = await col.Coleccion.find({ activa: true });
  callback(colecciones);
}

async function getColeccion(param, callback) {
  await col.Coleccion.find({ mod: param })
    .then((resultado) => {
      // if(resultado.length != 0 && !resultado[0].captions ){

      //     resultado[0].captions ={"es":"---------",
      //                         "fr": "----------",
      //                         "en": "---------"
      //                         }

      // }

      callback(resultado);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function addColeccion(coleccion, callback) {
  //console.log("Recibido por addColeccion" + coleccion);

  await coleccion
    .save()
    .then(callback)
    .catch((err) => {
      callback(new Error("Error al añadir la coleccion <br>" + err), {});
    });
}

async function deleteColeccion(nombre, callback) {
  const result = await col.Coleccion.deleteOne({ mod: nombre });

  callback(result);
}

function updateColeccion(coleccion, callback) {
  //buscamos por modelo en primer lugar
  //console.log("recibido por update coleccion " + coleccion )
  col.Coleccion.findOne({ _id: coleccion._id }, (err, result) => {
    if (!result) {
      console.log(err);
      return err;
    }

    result.set({
      captions: coleccion.captions,
      desc: coleccion.desc,
      mod: coleccion.mod,
      thumbnail: coleccion.thumbnail,
      activa: coleccion.activa,
    });

    result.save();

    callback(result);
  });
}

async function getImagenesColeccion(coleccion, callback) {
  const colecciones = await img.Imagen.find({ colecciones: coleccion });
  callback(colecciones);
}

module.exports.updateColeccion = updateColeccion;
module.exports.deleteColeccion = deleteColeccion;
module.exports.addColeccion = addColeccion;
module.exports.getColeccion = getColeccion;
module.exports.getColecciones = getColecciones;
module.exports.getColeccionesActivas = getColeccionesActivas;
module.exports.getImagenesColeccion = getImagenesColeccion;
module.exports.Coleccion = col.Coleccion;
module.exports.Imagen = img.Imagen;
