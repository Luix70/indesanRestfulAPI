const express=require("express");
const app = express();

const auth = require("./routes/auth");
const colecciones = require("./routes/colecciones.js");
const usuarios = require("./routes/users.js");
const raiz = require("./routes/root.js");
const fs=require("fs");
const https= require("https");
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
app.use ("/", raiz);
app.use("/colecciones", colecciones);
app.use("/usuarios", usuarios);
app.use("/auth",auth);
app.use(express.static("./static"));

var port = config.get("PORT") || 3000;
var sPort = config.get("sPORT") || 5000;
//si escucha en el puerto 3000 / 5000 es por que no ha podido 
//leer las variables de entorno

var httpsOptions={
    key: fs.readFileSync("./https/key.pem"),
    cert:  fs.readFileSync("./https/cert.pem")
}
https.createServer(httpsOptions , app).listen(sPort,()=>{
    console.log(`Escuchando (https) en el puerto: ${sPort}`)
})

app.listen(port, ()=>{
     console.log(`Escuchando (http) en el puerto: ${port}`)
});
