// var sql = require("./sql")
var modules = require("../modules/index");

module.exports = {
	run:_do,
	single:doTask
}

function _do(chain){
	var Loops = {}

	for (var i=0;i<chain.loops.length;i++){

		if (!modules.get(chain.loops[i].module)){
			console.log("The Runner Don't Support Module '"+chain.loops[i].module+"'");
			return;
		}

		Loops[chain.loops[i].id]=chain.loops[i];
		Loops[chain.loops[i].id].next = [];
	}

	for (var j=0;j<chain.relations.length;j++){
		Loops[chain.relations[j].from_loop_id].next.push(chain.relations[j].to_loop_id)
	}

	Loops.zone_id = chain.zone_id;
	Loops.start_at = Math.floor(Date.now() / 1000)
	// console.log(Loops);

	doTask(Loops,Loops[chain.init_loop_id],chain.input)

}

function moduleCheck(){

}

function doTask(Loops,task,input){
	return new Promise(function(resolve, reject) {

		// console.log(task)
		console.log("Doing Task "+task.id)


		if (!modules.get(task.module)){
			return;
		}


		// var meta = {};
		// try {
		// 	meta = JSON.parse(task.meta)
		// }
		// catch(err){
		// 	return;
		// }

		// Worker Log INPUT

		Loops[task.id].input = input;

		modules.get(task.module)(input||{},task.meta,function(output){

			if (!output){
				console.log("Finished "+ task.id + ", no output, loop ends");
				// writeLog(Loops);
				return;
			}

			console.log("Finished "+ task.id + ", the output is:");
			console.log(output);

			for (var i=0;i<task.next.length;i++){
				
				console.log("Checking for "+task.next[i]);
				doTask(Loops,Loops[task.next[i]],output);
			}

			// Worker Log OUTPUT
			// Loops[task.id].output = output;
			// writeLog(Loops);
		})


	});
}