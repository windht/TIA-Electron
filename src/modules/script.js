module.exports = function(input,meta,output){

	console.log("Doing Custom Scripts");

	try {
		eval(meta.script);
	}
	catch(err){
		console.error(err);
		output(false)
	}
}