// module.exports = {
// 	request:require("./request"),
// 	filter:equire("./filter"),
// 	email:require("./email"),
// 	custom:require('./custom'),
// 	script:require('./script'),
// 	crhomeless:require('./chromeless')
// }

module.exports = {
	get:function(module){
		try {
			return require('./'+module)
		}
		catch(err){
			console.log(err);
			return false;
		}
	}
}
