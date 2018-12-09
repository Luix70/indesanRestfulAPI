const express=require("express");
const app = express();
const cors = require("cors");
const routes = require("./routes/routes.js");
app.use(cors()); // enable cross origin requests
app.use("/", routes);

var port = process.env.PORT || 3000;

app.listen(port, ()=>{
     console.log(`Escuchando en el puerto: ${port}`)
});
