const express=require("express");
const app = express();
const routes = require("./routes/routes.js");

app.use("/", routes);

var port = process.env.PORT || 3000;

app.listen(port, ()=>{
     console.log(`Escuchando en el puerto: ${port}`)
});