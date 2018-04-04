var objectPath = require("object-path");
var vm = require('vm');

module.exports = function(input,meta,output){

	if (meta.type=="object-path") {
		output(objectPath.get(input,meta.path));
	}

	else if (meta.type=="custom"){
		var sandbox = {
			input:input
		}
		var script = new vm.Script(meta.script);
		var context = new vm.createContext(sandbox);
		script.runInContext(context);
		output(sandbox.input);
	}

	else if (meta.type=="condition"){
		var sandbox = {
			bool:true,
			input:input
		};
		// console.log("bool="+meta.condition)
		var script = new vm.Script("bool="+meta.condition);
		var context = new vm.createContext(sandbox);
		script.runInContext(context);
		// console.log(sandbox.bool);
		if (sandbox.bool){
			output(input);
		}
		else {
			output(false);
		}
	}

	else {
		output(false);
	}

	// console.log(objectPath.get(input,meta.path));
}