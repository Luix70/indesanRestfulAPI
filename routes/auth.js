const {User} = require("../models/user"); 
// no importamos la funcion validate de user, ya que solo queremos
// una funcion que nos valide emai y passwortd
// así que la obviamos y creamos una nueva aqui
const Joi = require("joi");
const mongoose = require("mongoose");
const express=require("express");
const router = express.Router();
const _ = require("lodash"); //utiliades
const bcrypt=require("bcryptjs");


router.post("/", async (req , res) => {
    //validamos  con joi el usuario que nos viene en el body
    // y lo destructuramos para obtener el error
    const {error} = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message); //estructura del error que devuelve joi

    //make sure this user EXISTS
    let user = await User.findOne({ email: req.body.email});
    if (!user)  return res.status(400).send("invalid email or password"); 

    //let's validate the password

    const validPassword = await bcrypt.compare(req.body.password, user.password); 
    // compare will use salt stored as part of user.password to re-generate
    // a new password from req.body.password and compare it to user.password

    if (!validPassword) return res.status(400).send("invalid email or password");
     //we give no clues on what went wrong

    //let's generate a JSON Web Token with some payload
    const token= user.generateWT();
    
    
    res.send(token);

});


// no importamos la funcion validate de user, ya que solo queremos
// una funcion que nos valide emai y passwortd
// así que la obviamos y creamos una nueva aqui
function validate(req){
    const schema  = {
        email : Joi.string().min(5).max(255).required().email(), //el metodo email nos asegura que es un email valido
        password : Joi.string().min(5).max(255).required(), // solo 255 por que esta es la contraseña sin hashear
    };

    return Joi.validate(req , schema);
};
module.exports = router;