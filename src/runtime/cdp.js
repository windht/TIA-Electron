const CDP = require('chrome-remote-interface');

module.exports = function(){
    run:run
}

async function run(body){
    try {
        eval(body.code);
    }
    catch(err){
        console.log(err);
    }
}

async function getTab(url){

    const versionRes = await axios.get("http://localhost:9222/json/version");
    const browserWSEndpoint = versionRes.data.webSocketDebuggerUrl;

    const browser = await puppeteer.connect({
        browserWSEndpoint:browserWSEndpoint
    });

    var list = await browser.pages();

    var targetTab;
    list.forEach(function(page){
        if (page.url()==url){
            targetTab = page;
        }
    })

    return targetTab;

}