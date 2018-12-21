
var token = sessionStorage.getItem("token").replace('"','');

function recuperarContenido(ruta, next){
    
    var xhr = new XMLHttpRequest;

    xhr.onreadystatechange = function(e){
        
        if (xhr.readyState == 4 && xhr.status == 200) {
            //todo ha ido bien
            contenido.innerHTML= xhr.response;
            next();
        }
    
        if (xhr.readyState == 4 && xhr.status != 200) {
            
            contenido.innerHTML=  xhr.response;
            
        }
    
    }
    
    var contenido = document.getElementById("contPrincipal");
    
    xhr.open("GET",ruta, true);
    xhr.setRequestHeader("Content-type","application/json; charset=utf-8");
    console.log("Valor del token que pasamos : " + token);
    xhr.setRequestHeader("x-auth-token", token);
    xhr.send();

}


function mostrar_usuarios(){
    recuperarContenido("/usuarios");
}

function mostrar_usuarioActual(){

    recuperarContenido("/usuarios/me");

}
function mostrar_colecciones(){

    recuperarContenido("/colecciones");

}
function mostrar_formBusqueda(){

    recuperarContenido("/colecciones/buscar",generarFilePond);
    
    
}

function cerrar_sesion(){
     token = "";
    sessionStorage.setItem("token",token);
//    console.log("Establecido el valor del token en: " + sessionStorage.getItem("token"));
    var contenido = document.getElementById("contPrincipal");
    contenido.innerHTML="-";
    
}

function generarFilePond(){
    const inputElement = document.getElementById('filepond__input');
    const pond = FilePond.create( inputElement );
    console.log(inputElement);
    FilePond.setOptions({
            server: endpoint + 'colecciones/upload'
    });

}
