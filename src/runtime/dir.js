let fs = require("fs-extra");
let APP_PATH = require("./path");

module.exports = {
    init:init
}

function init(){
    fs.ensureDirSync(APP_PATH.TIA_HOME_DIR);
    fs.ensureDirSync(APP_PATH.TIA_TEMP_DIR);
}