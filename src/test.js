const chromeLauncher = require('chrome-launcher');
// const { app } = require("electron");
const path = require("path");
chromeLauncher.launch({
    port:10411,
    // flags:["--user-data-dir=C:\\Users\\Tony\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 1"]
    userDataDir:false,
    forceDefaultProfile:true
    // chromeFlags:['--enable-automation']
}).then(chrome => {
    console.log(`Chrome debugging port running on ${chrome.port}`);
});