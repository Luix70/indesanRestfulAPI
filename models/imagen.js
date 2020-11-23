const mongoose = require("mongoose");
const Joi = require("joi"); //para validacion de datos de entrada

const captionsSchema = new mongoose.Schema({
  es: { type: String, required: true, default: "es_caption" },
  en: { type: String, default: "en_caption" },
  fr: { type: String, default: "fr_caption" },
});

const modelSchema = new mongoose.Schema({
  cod_modelo: { type: String, required: true, default: "sm" },
  desc: { type: captionsSchema, default: () => ({}) },
});

const imgSchema = new mongoose.Schema({
  nombre_tn: { type: String, required: true, unique: true },
  nombre_img: { type: String, required: true },
  nombre_img_hr: { type: String },
  folder: { type: String },
  colecciones: [String],
  modelos: [{ type: modelSchema, required: true, default: modelSchema }],
  pieFoto: { type: captionsSchema, default: () => ({}) },
  instrucciones: { type: String },
  tecnico: { type: String },
  video: { type: String },
});

const Imagen = mongoose.model("imagenes", imgSchema);

function validateImagen() {
  const schema = {
    // mod : Joi.string().min(2).max(25).required(),
    // thumbnail : Joi.string().min(5).max(50),
    // activa : Joi.boolean()
  };

  // return Joi.validate(coleccion , schema);
  return true;
}

module.exports.Imagen = Imagen;
module.exports.validate = validateImagen;
