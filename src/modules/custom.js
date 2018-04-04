var vm = require('vm');

module.exports = function(input,meta,output){
	var sandbox = {
		input:input
	}
	var script = new vm.Script(meta.script);
	var context = new vm.createContext(sandbox);
	script.runInContext(context);
	output(sandbox.input);
}