function login_authenticate( redireccion){

    var xhr = new XMLHttpRequest;

    xhr.onreadystatechange = function(e){
        if (xhr.readyState == 4 && xhr.status == 200) {
    
            //todo ha ido bien. tenemos un token en la respuesta
            token = xhr.response;
            
            //Lo almacenamos en Session
            sessionStorage.setItem("token", token);
            
            //redirigimos a la pagina deseada
            //console.log("redireccionamos a " + redireccion);
            
            recuperarContenido(redireccion, token);
            
        }
    
        if (xhr.readyState == 4 && xhr.status != 200) {
            document.getElementById("txt_respuesta").innerHTML= xhr.response;
        }
    
    };

    var email = document.getElementById("txtEmail_login").value;
    var pwd = document.getElementById("txtEmail_pwd").value;

    //console.log(`Email: ${email} / pwd: ${pwd}`);

    xhr.open('POST', "/auth", true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    var  data=  { "email" :  email , "password" : pwd };
    
    xhr.send(JSON.stringify(data)); 

    function recuperarContenido(ruta,token){
    
        var xhr = new XMLHttpRequest;
    
        xhr.onreadystatechange = function(e){
            
            if (xhr.readyState == 4 && xhr.status == 200) {
                //todo ha ido bien
                contenido.innerHTML= xhr.response;
            }
        
            if (xhr.readyState == 4 && xhr.status != 200) {
                
                contenido.innerHTML=  xhr.response;
                
            }
        
        }
    
        var contenido = document.getElementById("contPrincipal");
        //console.log(contenido.innerHTML);
        xhr.open("GET",ruta, true);
        xhr.setRequestHeader("Content-type","application/json; charset=utf-8");
        
        if (token) xhr.setRequestHeader("x-auth-token",token);
        xhr.send();
    
    }

}






