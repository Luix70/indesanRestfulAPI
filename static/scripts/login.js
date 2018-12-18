//console.log("Login funcinonando");
var xhr = new XMLHttpRequest;

xhr.onreadystatechange = procesarRespuesta;


function login_authenticate(){

    var email = document.getElementById("txtEmail_login").value;
    var pwd = document.getElementById("txtEmail_pwd").value;

    //console.log(`Email: ${email} / pwd: ${pwd}`);

    //xhr.open('POST', endpoint + "colecciones/save", true);
    //TODO: hacer que endpoint sea variable

    xhr.open('POST', "/auth", true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    var  data=  { "email" :  email , "password" : pwd };
    
    xhr.send(JSON.stringify(data)); 

}




function procesarRespuesta(e){
    if (xhr.readyState == 4 && xhr.status == 200) {

        //todo ha ido bien. tenemos un token en la respuesta
        token = xhr.response;
        
        //Lo almacenamos en Session
        sessionStorage.setItem("token", token);
        
        //redirigimos a la pagina deseada
        
        var params = new URLSearchParams(window.location.search);
        var redireccion = params.get("redirect");
        
        //TO DO:
        console.log("redireccionamos a " + redireccion);
        
        //window.open(redireccion,"_self");
        
    }

    if (xhr.readyState == 4 && xhr.status != 200) {
        document.getElementById("txt_respuesta").innerHTML= xhr.response;
    }

}

