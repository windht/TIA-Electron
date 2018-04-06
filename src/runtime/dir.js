let fs = require("fs");
let APP_PATH = require("./path");

module.exports = {
    init:init
}


function init(){
    createIfNotExists(APP_PATH.TIA_HOME_DIR);
    createIfNotExists(APP_PATH.TIA_TEMP_DIR);
}

function createIfNotExists(_path){
    if (!fs.existsSync(_path)){
        console.log("'"+_path+"' Not Exists, Creating")
        fs.mkdirSync(_path);
    }
    else {
        console.log("'"+_path+"' Exists, Jumping")
    }
}