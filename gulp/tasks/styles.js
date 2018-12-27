var gulp = require("gulp");
var concat = require("gulp-concat");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var mixins= require("postcss-mixins");
var cssvars = require("postcss-simple-vars");
var cssnested=require("postcss-nested");
var cssimport = require("postcss-import");

gulp.task("cs",  async function(){
    //console.log("tarea que unirá todos los archivos de estilos en uno " );
    return gulp.src( "./static/styles/**/*.css").
    pipe(postcss([cssimport, mixins, autoprefixer, cssvars, cssnested])). //imports must be done at the very beginning
    pipe(concat("_styles.css")).
    pipe(gulp.dest( "./static"));
});
