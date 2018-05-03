var OSS = require("ali-oss").Wrapper;

module.exports = function(input,meta,output){
    var client = new OSS(meta.oss);
    var uploads = input.map(function(file){
        return client.put(file.name, file.path);
    })
    Promise.all(uploads).then(function(results){
        output(results)
    }).catch(function(err){
    	console.log(err);
    	output(false);
    })
}
