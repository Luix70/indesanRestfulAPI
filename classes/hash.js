const bcrypt=require("bcrypt");

async function run(){
    const salt  = "$2b$05$mvj4HlFYy/sOhYu3sxGKSe" //await bcrypt.genSalt(5);
    const hash= await bcrypt.hash("1234",salt);
    console.log(salt);
    console.log(hash);
}

run();


module.exports = bcrypt;