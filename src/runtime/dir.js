let fs = require("fs");
let APP_PATH = require("./path");

// Create The Home Dir For TIA
if (!fs.existsSync(TIA_HOME_DIR)){
    console.log("TIA Home DIR Not Exists, Creating")
    fs.mkdirSync(APP_PATH.TIA_HOME_DIR);
}
else {
    console.log("TIA Home DIR Exists, Jumping")
}
      
if (!fs.existsSync(APP_PATH.TIA_TEMP_DIR)){
    console.log("TEMP DIR Not Exists, Creating")
    fs.mkdirSync(TIA_TEMP_DIR);
}
else {
    console.log("TEMP DIR Exists, Jumping")
}