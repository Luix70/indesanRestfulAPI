
var res = document.getElementById("resultado");
var xhr = new XMLHttpRequest;


//console.log(endpoint);

xhr.onreadystatechange = procesarRespuesta;

function query(){

  var col = document.getElementById("coleccion").value;

  //averiguemos el idioma
  var   lan ="es"; //default
  if (document.getElementById("en").checked ) lan = "en";
  if (document.getElementById("fr").checked ) lan = "fr";

  xhr.open('GET', endpoint + lan +"/" + col, true);
  xhr.send();

}  

function deleteColeccion(){
    var col = document.getElementById("coleccion").value;
    xhr.open('DELETE', endpoint + col, true);
    xhr.send();
}
function leerCampos(origen){
    if (origen === "actual"){
        var col = document.getElementById("coleccion").value.toLowerCase();
        var img = document.getElementById("nombreImagen").innerHTML;
        var _id = document.getElementById("_id").innerHTML;
        var es_caption = document.getElementById("es_cap").value;
        var fr_caption = document.getElementById("fr_cap").value;
        var en_caption = document.getElementById("en_cap").value;

    }


    if (origen === "nuevo"){
        var col = document.getElementById("nuevaColeccion").value.toLowerCase();
        var img = document.getElementById("nuevoThumb").value;
        var _id = "?";
        var es_caption = document.getElementById("es_caption").value;
        var fr_caption = document.getElementById("fr_caption").value;
        var en_caption = document.getElementById("en_caption").value;

    }

    return JSON.stringify({     "mod":col,
                                "_id": _id,
                                "imagen": img,
                                "es_caption" : es_caption,
                                "fr_caption" : fr_caption,
                                "en_caption" : en_caption});


}


function updateColeccion(){

    var data=leerCampos("actual");

    xhr.open('PUT', endpoint + col, true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    //console.log(data);                            
    xhr.send(data); 
}



function create(){
    var data = leerCampos("nuevo");
    xhr.open('POST', endpoint + col, true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.send(data);   
}


function procesarRespuesta(e){

    var intro = document.getElementById("addCollection");
    var nav=document.getElementById("navigation");

    if (xhr.readyState == 4 && xhr.status == 200) {
        //todo ha ido
        res.innerHTML= xhr.response;

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