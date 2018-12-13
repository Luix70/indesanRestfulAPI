var mongoose = require("mongoose")
var Joi = require("joi"); //para validacion de datos de entrada

const User = mongoose.model("usuarios" , new mongoose.Schema({
    name:{
        type : String,
        required : true,
        minlength : 5,
        maxlength: 50
    },
    email:{
        type : String,
        required : true,
        unique:true,
        minlength : 5,
        maxlength: 255
    },
    password:{
        type : String,
        required : true,
        minlength : 5,
        maxlength: 1024 // se van a almacenar hasheadas
    }
}));

function validateUser(user){
    const schema  = {
        name : Joi.string().min(5).max(50).required(),
        email : Joi.string().min(5).max(255).required().email(), //el metodo email nos asegura que es un email valido
        password : Joi.string().min(5).max(255).required(), // solo 255 por que esta es la contraseña sin hashear
    };

    return Joi.validate(user , schema);
};

module.exports.User = User;
module.exports.validate = validateUser;