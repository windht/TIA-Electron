let path = require("path");
let app = require("electron").app;


let assetDir = path.join(__dirname,'../assets');

module.exports = {
    ICON_PATH:path.join(assetDir,'icon.png'),
    MAC_TRAY_PATH:path.join(assetDir,'icon_16x16.png'),
    TIA_TEMP_DIR:path.join(app.getPath("temp"),"TIA_TEMP"),
    TIA_HOME_DIR:path.join(app.getPath('home'),"TIA"),
    DB_PATH:path.join(app.getPath('home'),"TIA","tia.json")
}