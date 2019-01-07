const mongoose = require("mongoose");
const Joi = require("joi"); //para validacion de datos de entrada

const captionsSchema = new mongoose.Schema({
    es: {type: String, required: true, default:"es_caption"},
    en: {type: String, default:"en_caption"},
    fr: {type: String, default:"fr_caption"}

});

const descripSchema = new mongoose.Schema({
    es: {type: String, required: true, default:"es_descripcion"},
    en: {type: String,  default:"en_descripcion"},
    fr: {type: String ,  default:"fr_descripcion"}

});


const colSchema = new mongoose.Schema({
    mod : {type: String, required : true, unique: true},
    thumbnail : {type: String, default : "Nothumb_tn"} ,
    activa:{ type: Boolean, default: true},
    captions: {type: captionsSchema, default: captionsSchema},
    desc: {type: descripSchema, default: descripSchema}
});

const Coleccion = mongoose.model('colecciones',colSchema);

function validateColeccion(){
    
    const schema  = {
        mod : Joi.string().min(2).max(25).required(),
        thumbnail : Joi.string().min(5).max(50), 
        activa : Joi.boolean()
    };

    return Joi.validate(coleccion , schema);
};

module.exports.Coleccion=Coleccion;
module.exports.validate=validateColeccion;
