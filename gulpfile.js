var gulp = require("gulp");
var watch = require("gulp-watch");

gulp.task('default', async function(){
    console.log("tarea de gulp funcionando");
});


var cj= gulp.task("cj", async function(){
    console.log("tarea que unirá todos los archivos de javascript en uno");
});

var rn=gulp.task("rn", async function(){
    console.log("tarea que reiniciará nodo");
});

gulp.task("watch", async function(){
    console.log("tarea que vigila jos javasscripts");
    watch("./static/scripts/**/*.js",gulp.series("cj","rn"));
})
