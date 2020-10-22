const express=require("express");
const router = express.Router();
const db = require("../classes/dbconnections.js");
router.get("/:coleccion",(req,res)=>{
    var nomcoleccion = req.params.coleccion;
    db.getImagenesColeccion(nomcoleccion,(imagenes)=>{
        res.json(imagenes);
    });

})

module.exports = router
