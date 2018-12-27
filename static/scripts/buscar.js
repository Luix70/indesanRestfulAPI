

var xhr = new XMLHttpRequest;


//console.log(endpoint);

xhr.onreadystatechange = procesarRespuesta;

function leerCampos(origen){

    if (origen === "actual"){
        var mod = document.getElementById("coleccion").value.toLowerCase();
        var thumbnail = document.getElementById("nombreImagen").innerHTML;
        var _id = document.getElementById("_id").innerHTML;
        var es_caption = document.getElementById("es_cap").value;
        var fr_caption = document.getElementById("fr_cap").value;
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