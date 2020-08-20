const express=require("express");
const router = express.Router();
const fs = require("fs");
var endpoint;

router.get("/", (req,res)=>{
    endpoint =  req.protocol + "://" + req.headers.host + "/";
    fs.readFile("./views/default.html",(err, data)=>{
        if(err){
         return  res.status(400).send("default.html no encontrado");
        }
        var textDat = data.toString();
        //req.protocol: http or https
        //req.headers.host: localhost:2001, por ejemplo

        res.send(textDat.replace(/:endpoint:/g, endpoint));
    });

})


module.exports = router;