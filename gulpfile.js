var gulp = require("gulp");
var watch = require("gulp-watch");
var concat = require("gulp-concat");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var cssvars = require("postcss-simple-vars");
var cssnested=require("postcss-nested");
var cssimport = require("postcss-import");

gulp.task('default', async function(){
    console.log("tarea de gulp funcionando");
});


gulp.task("cj", async function(){
    console.log("tarea que unirá todos los archivos de javascript en uno");
    return gulp.src("./static/scripts/**/*.js"). //seleccionamos todos los scripts del directorio de scripts
                pipe(concat("_script.js")). //Los concatenamos en un archivo unico
                pipe(gulp.dest("./static")); //y lo guardamos en un nivel superior, que es el que enlazará a default.html
});

gulp.task("cs", async function(){
    console.log("tarea que unirá todos los archivos de estilos en uno");
    return gulp.src("./static/styles/**/*.css").
    pipe(postcss([cssimport, autoprefixer, cssvars, cssnested])). //imports must be done at the very beginning
    pipe(concat("_styles.css")).
    pipe(gulp.dest("./static"));
});

gulp.task("rn", async function(){
    console.log("tarea que reiniciará node");
});

gulp.task("watch", async function(){
    console.log("tarea que vigila jos javasscripts");
    watch("./static/scripts/**/*.js",gulp.series("cj","rn"));

    watch("./static/styles/**/*.css",gulp.series("cs","rn"));

})
