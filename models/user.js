const mongoose = require("mongoose")
const Joi = require("joi"); //para validacion de datos de entrada
const jwt = require("jsonwebtoken");
const config= require("config");

const userSchema = new mongoose.Schema({
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
});

userSchema.methods.generateWT = function(){
    return jwt.sign({_id: this._id, name: this.name, email: this.email}, config.get("JWTKey") );
    //'this' will be the instance when created
    // DO NOT USE AN ARROW FUNCTION: WE'D LOSE THE REFERENCE TO  context 'this'
};
const User = mongoose.model("usuarios" , userSchema);

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
// We don't have to export generateWT, because it's part of the user's "prototype"
