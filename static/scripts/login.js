//console.log("Login funcinonando");
var xhr = new XMLHttpRequest;
var xhr2= new XMLHttpRequest;
xhr.onreadystatechange = procesarRespuesta;
xhr2.onreadystatechange = redirigir_autorizado;

function login_authenticate(){

    var email = document.getElementById("txtEmail_login").value;
    var pwd = document.getElementById("txtEmail_pwd").value;

    console.log(`Email: ${email} / pwd: ${pwd}`);

    //xhr.open('POST', endpoint + "colecciones/save", true);
    //TODO: hacer que endpoint sea variable

    xhr.open('POST', "https://localhost:3001/auth", true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    var  data=  { "email" :  email , "password" : pwd };
    console.log(data);
    respuesta = xhr.send(JSON.stringify(data)); 

}



function procesarRespuesta(e){
    if (xhr.readyState == 4 && xhr.status == 200) {


        //todo ha ido bien. tenemos un token en la respuesta
        var token = xhr.response;
        console.log(token);

        //Lo almacenamos en Session
        sessionStorage.setItem("token", token);
        
        //redirigimos a la pagina deseada
        
        xhr2.open('GET', "/users/me", true);
        xhr2.setRequestHeader('Content-type','application/json; charset=utf-8');
        xhr2.setRequestHeader('x-auth-token',token);
        respuesta=xhr2.send();
        
        
        }

    if (xhr.readyState == 4 && xhr.status != 200) {
        
        var err = xhr.response;
        
        console.log(err);

        document.getElementById("txt_respuesta").innerHTML = err;
        
        }

}

function redirigir_autorizado(e){
    if (xhr2.readyState == 4 && xhr2.status == 200) {
    
        console.log ( "---" + xhr2.response);
            
        document.getElementById("container_login") .innerHTML=JSON.stringify( xhr2.response) ;
        
        
    }
    
    if (xhr2.readyState == 4 && xhr2.status != 200) {
        
        var err = xhr2.response;
        
        console.log(err);
    
        document.getElementById("txt_respuesta").innerHTML = err;
           
    }
    
    }