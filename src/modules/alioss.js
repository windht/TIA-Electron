var OSS = require("ali-oss").Wrapper;

module.exports = function(input,meta,output){
	async function upload(){
		console.log(meta.oss);
        var client = new OSS(meta.oss);
        var object = await client.put(input.name, input.path);
        output(object)
    }
    upload().catch(function(err){
    	console.log(err);
    	output(false);
    })
}
