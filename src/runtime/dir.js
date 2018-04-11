let fs = require("fs-extra");
let APP_PATH = require("./path");

module.exports = {
    init:init
}

function init(){
    fs.ensureDirSync(APP_PATH.TIA_HOME_DIR);
    fs.ensureDirSync(APP_PATH.TIA_TEMP_DIR);
}

// function createIfNotExists(_path){
//     if (!fs.existsSync(_path)){
//         console.log("'"+_path+"' Not Exists, Creating")
//         fs.mkdirSync(_path);
//     }
//     else {
//         console.log("'"+_path+"' Exists, Jumping")
//     }
// }