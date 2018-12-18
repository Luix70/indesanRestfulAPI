const jwt=require("jsonwebtoken");
const config = require("config");
const fs = require("fs");

module.exports =  function(req, res, next){


    //BYPASSING AUTHENTICATION
    //return next();
    //


    // First, we retrieve the token from the header
    const token = req.header('x-auth-token');

    //if there's no token, abort the request with erroe code 401
        //if(!token) return res.status(401).send("Unauthorized (no token found )");

    //another option: we redirect to login page

    if(!token) {
        fs.readFile("./views/login.html",(err,data) =>{

            if (err) return res.status(404).send("login.html no encontrado " + err);

            //enviamos el codigo del formulario de login para que el usuario introduzca la contraseña
            return res.send(data);
                
        })
 
    } else {

        //We have the token. Proceed to extract payload
        try{
            const tokenPayload =  jwt.verify(token , config.get("JWTKey"));
            //if token is invalid, 'verify returns an error. Hence, the try/catch structure

            //console.log("token valid: " + JSON.stringify(tokenPayload));

            //Once we have the payload, we add it to the body of the request
            req.currentUser = tokenPayload;

            //Important: invoke next() at some point of middleware will stop execution

            next();

            //beware: if there are mor lines in the function body they will be executed
            //asyncronously even after next() is invoked
            //This may cause errors like "Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client"
            //hard to detect.

            //We could prevent this by calling  return next(); instead of simply next();
            

        }catch(er){
            return res.status(401).send("Unauthorized (token invalid)");
        }
    }


   
    

}