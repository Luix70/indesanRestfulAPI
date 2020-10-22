var gulp = require("gulp");
var concat = require("gulp-concat");


gulp.task("cj", async function(){
    console.log("tarea que unirá todos los archivos de javascript en uno");
    gulp.src("./static/scripts/**/*.js"). //seleccionamos todos los scripts del directorio de scripts
                pipe(concat("_script.js")). //Los concatenamos en un archivo unico
                pipe(gulp.dest("./static")); //y lo guardamos en un nivel superior, que es el que enlazará a default.html
    return;
});
