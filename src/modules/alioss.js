var OSS = require("ali-oss").Wrapper;

module.exports = function(input,meta,output){

    console.log(meta.oss);
    var client = new OSS(meta.oss);

	function upload(file){
        return client.put(file.name, file.path);
    }

    var uploads;
    if (input.isArray){
        uploads = input.map(function(file){
            return upload(file)
        })
    }
    else {
        uploads = [input]
    }

    Promise.all(uploads).then(function(results){
        output(results)
    }).catch(function(err){
    	console.log(err);
    	output(false);
    })
}
