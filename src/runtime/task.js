let modules = require("../modules/index");
let db = require("./db");

let Queue = db.get("queue").write();
let Logs = db.get("logs").write();
let Executing = db.get("executing").write();


module.exports = {
	run:_do,
	single:doTask,
	handleQueue:handleQueue
}

function _do(chain){
	runChain(chain);
}

function moduleCheck(){

}

function runChain(chain,startIndex){
	if (Executing.state){
		chain.queueAt = new Date();
		Queue.push(chain);
		db.get("queue").write();
		return;
	}

	let Loops = {};
	Loops.console = [];
	consoleLog("Chain Starts",Loops);
	
	

	

	Loops.sequence = [];
	for (var i=0;i<chain.loops.length;i++){

		if (!modules.get(chain.loops[i].module)){
			consoleLog("The Runner Don't Support Module '"+chain.loops[i].module+"'",Loops);
			return;
		}

		Loops[chain.loops[i].id]=chain.loops[i];
		Loops[chain.loops[i].id].next = [];

		if (!chain.loops[i].disabled){
			Loops.sequence.push(chain.loops[i].id);
		}
	}

	if (chain.relations){
		for (var j=0;j<chain.relations.length;j++){
			// if (j==0){
			// 	Loops.sequence.push(chain.relations[j].from_loop_id)
			// }
			// Loops.sequence.push(chain.relations[j].to_loop_id)
			Loops[chain.relations[j].from_loop_id].next.push(chain.relations[j].to_loop_id)
		}
	}

	consoleLog("The Task Is Running At Sequence ",Loops);
	consoleLog(Loops.sequence,Loops);

	Loops.zone_id = chain.zone_id;
	Loops.start_at = Math.floor(Date.now() / 1000);
	Loops.masterInput = chain.input;

	if (!startIndex){
		startIndex = 0
	}

	Executing.loops = Loops;
	delete chain.loops;
	Executing.chain = chain;
	Executing.state = true;

	db.get("executing").write()

	doTask(Loops,Loops[Loops.sequence[startIndex]],chain.input,function(output){
		Executing.loops = {};
		Executing.chain = {};
		Executing.state = false;
		db.get("executing").write()

		consoleLog("Chain Ends",Loops);
		if (Queue.length>0){
			consoleLog("Heading Next Chain In The Queue",Loops)
			runChain(Queue.shift())
			db.get("queue").write();
		}
	});


}

function doTask(Loops,task,input,END){
	return new Promise(function(resolve, reject) {

		// console.log(task)
		consoleLog("Doing Task "+task.id,Loops)


		if (!modules.get(task.module)){
			return;
		}

		// Worker Log INPUT
		Loops[task.id].input = input;

		// Fetch The Task Module Code
		modules.get(task.module)(input||{},task.meta,function(output){

			if (!output){
				consoleLog("Finished "+ task.id + ", no output, loop ends",Loops);
				writeLog(Loops);
				END(output)
				return;
			}

			consoleLog("Finished "+ task.id + ", the output is:",Loops);
			consoleLog(output,Loops);

			// Check if it is last;
			var taskIndex = Loops.sequence.indexOf(task.id);

			consoleLog("This Task Is At "+taskIndex+" In The Sequence",Loops);

			if ( taskIndex == Loops.sequence.length-1 ) {
				// Task Ends
				END(output)
			}
			else {
				var nextID = Loops.sequence[taskIndex+1]
				consoleLog("Next Task ID is" + nextID,Loops);
				doTask(Loops,Loops[nextID],output,END);
			}

			// for (var i=0;i<task.next.length;i++){
				
			// 	console.log("Checking for "+task.next[i]);
			// 	doTask(Loops,Loops[task.next[i]],output);
			// }

			// Worker Log OUTPUT
			Loops[task.id].output = output;
			writeLog(Loops);
		})


	});
}

function consoleLog(log,Loops){
	console.log(log);
	Loops.console.push(log);

	Executing.loops = Loops;
	db.get("executing").write()
}

function writeLog(Loops){
	Logs.push(Loops)
	db.get("logs").write();
}

function handleQueue(){

	Executing.loops = {};
	Executing.chain = {};
	Executing.state = false;
	db.get("executing").write()


	if (Queue.length>0){
		console.log("Queue Not Empty, Start Doing")
		runChain(Queue.shift())
		db.get("queue").write();
	}
	else {
		console.log("Queue Empty")
	}
}