var request = require("request");
var async = require("async");

module.exports = function(input, meta, output) {
    var result = [];


    var array = meta.source == "input" ? input : meta.id_list;

    async.each(array, function(id, fetchDone) {
        // async.eachSeries(input,function(url,fetchDone){
        console.log("Fetching Post For ID " + id)
        request({
            url: "https://graph.facebook.com/v2.10/" + id + "/posts?fields=id,message,created_time&limit=5&access_token=507801336230750|19bc14e92046482ca2b94cd745e94281",
            timeout: 5000,
            method: "GET",
            headers: {
                'User-Agent': "The Builder Crawl",
                'cache-control': 'no-cache',
            }
        }, function(err, response, body) {
            // body = JSON.parse(body);
            if (err) {
                console.log(err);
                return;
            }

            try {
                body = JSON.parse(body)
                result = result.concat(body.data);
            } catch (err) {
                console.log(err);
            }


            fetchDone();
        }, function(err) {
            if (err) {
                console.log(err)
            }
        })
    }, function(err) {
        if (err) {
            console.log(err)
        } else {
            // console.log(result)
            output(result)
        }
    })
}