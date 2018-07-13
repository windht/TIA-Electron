const CDP = require('chrome-remote-interface');
const axios = require('axios')
const puppeteer = require('puppeteer');

async function run(body){
    var page = await getTab("https://thebuilder.hk/");

    console.log("Connected")
    console.log(page);

    page.setViewport({
        width:1280,
        height:720
    })

    await page.click("#page-header-bg > div.scroll-down-wrap > a")
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

run().catch(function(err){
    console.log(err)
});

