import { start } from "repl";

let modules = require("../modules/index");
let Executing = false;
let Queue = [];

module.exports = {
	run:_do,
	single:doTask
}

function _do(chain){
	runChain(chain);
}

function moduleCheck(){

}

function runChain(chain,startIndex){
	if (Executing){
		Queue.push(chain);
		return;
	}

	console.log("Chain Starts");
	Executing = true;
	let Loops = {}

	Loops.sequence = [];
	for (var i=0;i<chain.loops.length;i++){

		if (!modules.get(chain.loops[i].module)){
			console.log("The Runner Don't Support Module '"+chain.loops[i].module+"'");
			return;
		}

		Loops[chain.loops[i].id]=chain.loops[i];
		Loops[chain.loops[i].id].next = [];

		if (!chain.loops[i].disabled){
			Loops.sequence.push(chain.loops[i].id);
		}
	}

	
	for (var j=0;j<chain.relations.length;j++){
		// if (j==0){
		// 	Loops.sequence.push(chain.relations[j].from_loop_id)
		// }
		// Loops.sequence.push(chain.relations[j].to_loop_id)
		Loops[chain.relations[j].from_loop_id].next.push(chain.relations[j].to_loop_id)
	}

	console.log("The Task Is Running At Sequence ");
	console.log(Loops.sequence);

	Loops.zone_id = chain.zone_id;
	Loops.start_at = Math.floor(Date.now() / 1000)


	if (!startIndex){
		startIndex = 0
	}

	doTask(Loops,Loops[Loops.sequence[startIndex]],chain.input,function(output){
		Executing = false;

		console.log("Chain Ends");
		if (Queue.length>0){
			console.log("Heading Next Chain In The Queue")
			runChain(Queue.shift())
		}
	});


}

function doTask(Loops,task,input,END){
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
				END(output)
				return;
			}

			console.log("Finished "+ task.id + ", the output is:");
			console.log(output);

			// Check if it is last;
			var taskIndex = Loops.sequence.indexOf(task.id);

			console.log("This Task Is At "+taskIndex+" In The Sequence");

			if ( taskIndex == Loops.sequence.length-1 ) {
				// Task Ends
				END(output)
			}
			else {
				var nextID = Loops.sequence[taskIndex+1]
				console.log("Next Task ID is" + nextID);
				doTask(Loops,Loops[nextID],output,END);
			}

			// for (var i=0;i<task.next.length;i++){
				
			// 	console.log("Checking for "+task.next[i]);
			// 	doTask(Loops,Loops[task.next[i]],output);
			// }

			// Worker Log OUTPUT
			// Loops[task.id].output = output;
			// writeLog(Loops);
		})


	});
}