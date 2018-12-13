const express=require("express");
const app = express();

const auth = require("./routes/auth");
const colecciones = require("./routes/colecciones.js");
const users = require("./routes/users.js");

const cors = require("cors");
const config= require("config");

//First task is to check for the existence of environment variables
//defined in config
//especially those required for security
//if they don't exist, we shall abort the execution

if(!config.get("JWTKey")){
     console.error("FATAL ERROR: No JWTKey");
     process.exit(1);
}


app.use(express.json());
app.use(cors());
app.use("/colecciones", colecciones);
app.use("/users", users);
app.use("/auth",auth);
app.use(express.static("./static"));

var port = config.get("PORT") || 3000;
//si escucha en el puerto 3000 es por que no ha podido 
//leer las variables de entorno


app.listen(port, ()=>{
     console.log(`Escuchando en el puerto: ${port}`)
});
