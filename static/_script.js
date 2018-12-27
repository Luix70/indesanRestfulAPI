

var xhr = new XMLHttpRequest;


//console.log(endpoint);

xhr.onreadystatechange = procesarRespuesta;

function leerCampos(origen){

    if (origen === "actual"){
        var mod = document.getElementById("coleccion").value.toLowerCase();
        var thumbnail = document.getElementById("nombreImagen").innerHTML;
        var _id = document.getElementById("_id").innerHTML;
        var es_caption = document.getElementById("es_cap").value;
        var fr_caption = document.getElementById("fr_cap").value;s
        var en_caption = document.getElementById("en_cap").value;

    }

    if (origen === "nuevo"){
        var mod = document.getElementById("nuevaColeccion").value.toLowerCase();
        var thumbnail = document.getElementById("nuevoThumb").value;
        var _id = "?";
        var es_caption = document.getElementById("es_caption").value;
        var fr_caption = document.getElementById("fr_caption").value;
        var en_caption = document.getElementById("en_caption").value;

    }

    var data = JSON.stringify({     "mod": mod,
                                    "_id": _id,
                                    "thumbnail": thumbnail,
                                    "es_caption" : es_caption,
                                    "fr_caption" : fr_caption,
                                    "en_caption" : en_caption});
    
    return  data;

}


function query(){

  var mod = document.getElementById("coleccion").value;

  //averiguemos el idioma
  var   lan ="es"; //default
  if (document.getElementById("en").checked ) lan = "en";
  if (document.getElementById("fr").checked ) lan = "fr";

  xhr.open('GET', endpoint + "colecciones/" + lan +"/" + mod, true);
  xhr.send();

}  

function deleteColeccion(){
    var  mod = document.getElementById("coleccion").value;
    xhr.open('DELETE', endpoint + "colecciones/" + mod, true);
    xhr.send();
}


function updateColeccion(){

    var data=leerCampos("actual");
    //console.log("Enviado por buscar.js: " + data);    
    xhr.open('PUT', endpoint + "colecciones/update" , true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.send(data); 
}


function create(){
    var data = leerCampos("nuevo");
    xhr.open('POST', endpoint + "colecciones/save", true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.send(data);   
}


function procesarRespuesta(e){
    var res = document.getElementById("resultado");
    var intro = document.getElementById("addCollection");
    var nav=document.getElementById("navigation");

    if (xhr.readyState == 4 && xhr.status == 200) {
        //todo ha ido bien
        res.innerHTML= xhr.response.replace(/:endpoint:/g, endpoint);

        intro.classList.remove("visible");
        intro.classList.add("invisible");

        nav.classList.remove("invisible");
        nav.classList.add("visible");

    }

    
    if (xhr.readyState == 4 && xhr.status != 200) {
        
        res.innerHTML= xhr.response;
        var search = document.getElementById("coleccion").value;
        
        intro.classList.remove("invisible");
        intro.classList.add("visible");

        nav.classList.remove("visible");
        nav.classList.add("invisible");
        
        document.getElementById("nuevaColeccion").value =search;
        document.getElementById("nuevoThumb").value = search.charAt(0).toUpperCase() + search.slice(1) + "_tn.jpg" ;
    }

}

function ocultar(){
    var intro = document.getElementById("addCollection");
    intro.classList.remove("visible");
    intro.classList.add("invisible");
}

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
    
    FilePond.setOptions({

            server: endpoint + 'colecciones/upload',
            
            labelIdle: "Arrastra aquí un archivo JPG o <br><span class='filepond--label-action'>clica para examinar</span>",
            labelFileLoadError: "Error al cargar el archivo ",
            labelFileProcessing: "Subiendo",
            labelFileProcessingComplete: "Carga Completa",
            labelFileProcessingAborted: "Carga Cancelada",
            labelFileProcessingError: "Error durante la subida",
            labelFileProcessingPaused: "Subida en pausa",
            labelTapToCancel: "pulsa para cancelar",
            labelTapToRetry: "pulsa para intentarlo",
            labelTapToUndo: "pulsa para deshacer"
    });

}

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






