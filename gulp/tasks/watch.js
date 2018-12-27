var gulp = require("gulp");
var watch = require("gulp-watch");
var browserSync = require("browser-sync").create();
gulp.task("watch", async function(){

    browserSync.init({
        notify:false,
        proxy:{
            target:"https://localhost:3001",
            ws:true
        }
        //, browser: "firefox"
    });
    
    watch("./static/scripts/**/*.js",gulp.series("cj","reload"));

    //encargamos a browseSync la tarea de actualizar el css, sin recargar la página
    watch("./static/styles/**/*.css", gulp.series("cs","cssInject"));
    
})

gulp.task("cssInject",  function(){
    console.log("inyeccion del archivo de estilo");
    return gulp.src("./static/_styles.css").pipe(browserSync.stream());

})

gulp.task("reload",  function(){
    browserSync.reload();
});