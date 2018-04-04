var request = require("request");
var async = require("async");

module.exports = function(input, meta, output) {
    if (meta.source == "input") {
        if (typeof(input) == "string") {
            output(false)
        } else {
            var result = [];
            // console.log(input)
            async.each(input, function(url, fetchDone) {
                // async.eachSeries(input,function(url,fetchDone){
                request({
                    url: url,
                    timeout: 5000,
                    method: meta.method || "GET",
                    headers: {
                        'User-Agent': "The Builder Crawl",
                        'cache-control': 'no-cache',
                    }
                }, function(err, response, body) {
                    // body = JSON.parse(body);
                    if (meta.parse === true) {
                        try {
                            body = JSON.parse(body)
                        } catch (err) {

                        }
                    }
                    result.push(body);
                    fetchDone();
                }, function(err) {
                    if (err) {
                        console.log(err)
                    } else {
                        output(result)
                    }
                })
            })
        }
    } else {

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
            console.log(input);
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
                // body = JSON.parse(body);


                if (meta.parse === true) {
                    try {
                        body = JSON.parse(body)
                    } catch (err) {

                    }
                }
                output(body);
            })
    }


}