const {User, validate} = require("../models/user"); // asignacion por object destructuring
const mongoose = require("mongoose");
const express=require("express");
const router = express.Router();
const _ = require("lodash"); //utiliades
const bcrypt=require("bcryptjs");
const config = require("config");
const auth_mw = require("../middleware/auth_mw")

router.get("/", auth_mw, async (req, res)=>{//devuelve todos los usuarios de la base de datos
    const users = await User.find().sort('name');
    res.send(users);
});



router.get("/me" , auth_mw, async function(req, res) {

    //console.log("Buscamos informacion del usuario: " + req.currentUser._id);
    const user = await User.findById( req.currentUser._id);
    
    res.send(_.pick(user,["name" , "email"]));

});


router.post("/", async (req , res) => {
    //validamos  con joi el usuario que nos viene en el body
    // y lo destructuramos para obtener el error
    const {error} = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message); //estructura del error que devuelve joi

    //make sure this user is not already registered (by email)
    let user = await User.findOne({ email: req.body.email});
    if (user)  return res.status(400).send("Error: Usuario registrado anteriormente."); 

    user = new User( _.pick(req.body , ["name", "email", "password"]));

    // Eqiuvalente a :
    //
    // user = new User({
    //     name : req.body.name,
    //     email: req.body.email,
    //     password: req.body.password
    // });
    // pero aplica un filtro a los datos de entrada que vienen en body
    // asi se evita cualquier untento de un usuario malicioso
    // de introducir datos no deseados en nuestra base de datos

    //antes de guardar los cambios hasheamos las contraseñas con el modulo bcrypt
    const salt  = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    user = await user.save();

    // We've succesfully added a new user. Now we are going to create a token to 
    // return it in the  header of the response, so the user can use it from now on

    const token= user.generateWT();
    
    //'no queremos mostrar la contraseña'
    res.header("x-auth-token",token).send(_.pick(user,["_id", "name", "email"]));

});

module.exports = router;