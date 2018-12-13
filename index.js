const express=require("express");
const app = express();

const routes = require("./routes/routes.js");
const users = require("./routes/users.js");

app.use("/", routes);
app.use("/users", users);

var port = process.env.PORT || 3000;
//si escucha en el puerto 3000 es por que no ha podido 
//leer las variables de entorno


app.listen(port, ()=>{
     console.log(`Escuchando en el puerto: ${port}`)
});
