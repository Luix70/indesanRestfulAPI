var fs = require( 'fs');
var EventEmitter = require( 'events');

function readFileText(nombre, ambito, callback){
    process.nextTick(()=>{
        var content = fs.readFileSync(nombre);
        ambito.emit('while');
        callback(content.toString());
    });
}

class TextReader extends EventEmitter {

    constructor() {
        super();
    }

    read(nombre, callback){

        this.emit('start');

        readFileText(nombre,this,(content) => {
            
            callback(content);

            this.emit('end');

        })

    }

}


module.exports = TextReader;


