const { Chromeless } = require('chromeless')
const chromeLauncher = require('chrome-launcher');
const { app } = require("electron");
const path = require("path");

// let chrome;

module.exports = function(input, meta, output) {
    console.log("Launching Chrome")
    // console.log(input);
    chromeLauncher.launch({
        port:10411,
        userDataDir:path.join(app.getPath("home"),"TIA"),
        // chromeFlags:['--enable-automation']
    }).then(chrome => {
        // chrome = _chrome;
        console.log(`Chrome debugging port running on ${chrome.port}`);
        try {
            eval(meta.script);
        } catch(err){
            chromeless.end();
            output(false);
            console.log(err);
        }
    });

    // let chromeless = new Chromeless({
    //     cdp:{host: 'localhost', port: 10411, secure: false, closeTab: true}
    // });

    
}