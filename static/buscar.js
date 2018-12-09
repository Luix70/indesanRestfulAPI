
var res = document.getElementById("resultado");
var xhr = new XMLHttpRequest;


console.log(endpoint);

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

function create(){
    var col = document.getElementById("nuevaColeccion").value.toLowerCase();
    var img = document.getElementById("nuevoThumb").value;
    var es_caption = document.getElementById("es_caption").value;
    var fr_caption = document.getElementById("fr_caption").value;
    var en_caption = document.getElementById("en_caption").value;

    xhr.open('POST', endpoint + col, true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.send(JSON.stringify({"imagen" : img,
                                "es_caption" : es_caption,
                                "fr_caption" : fr_caption,
                                "en_caption" : en_caption}));   
}


function procesarRespuesta(e){

    var intro = document.getElementById("addCollection");

    if (xhr.readyState == 4 && xhr.status == 200) {
        
        res.innerHTML= xhr.response;

        intro.classList.remove("visible");
        intro.classList.add("invisible");

    }

    if (xhr.readyState == 4 && xhr.status != 200) {
        
        res.innerHTML= xhr.response;
        var search = document.getElementById("coleccion").value;
        
        intro.classList.remove("invisible");
        intro.classList.add("visible");
        
        document.getElementById("nuevaColeccion").value =search;
        document.getElementById("nuevoThumb").value = search.charAt(0).toUpperCase() + search.slice(1) + "_tn.jpg" ;
    }

}

function ocultar(){
    var intro = document.getElementById("addCollection");
    intro.classList.remove("visible");
    intro.classList.add("invisible");
}