var request = require("request");

module.exports = function(input, meta, output) {
    var options;
    
    if (meta.method == "GET") {
        options = {
            url: meta.url,
            timeout: 5000,
            method: "GET",
            headers: {
                'User-Agent': "The Builder Crawl",
                'cache-control': 'no-cache'
            }
        }
    } else {
        // console.log(input);
        options = {
            url: meta.url,
            body: input,
            json:true,
            timeout: 5000,
            method: "POST",
            headers: {
                'User-Agent': "The Builder Crawl",
                'cache-control': 'no-cache',
                'content-type': 'application/json'
            }
        }
    }

    request(
        options,
        function(err, response, body) {
            if (meta.parse === true) {
                try {
                    body = JSON.parse(body)
                } catch (err) {
                    output(false);
                }
            }
            output(body);
    })
}