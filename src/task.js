// var sql = require("./sql")
var modules = require("./modules/index");

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



// function run(id,input,res){
// 	sql.do(`
// 		SELECT 
// 		chained_automation.loop_instance.*,
// 		chained_automation.loop.module

// 		FROM chained_automation.loop_instance 

// 		LEFT JOIN chained_automation.loop 
// 		ON chained_automation.loop.id = chained_automation.loop_instance.loop_id

// 		WHERE chained_automation.loop_instance.id="`+id+`"

// 	`,function(rows){

// 		if (rows.length==0){
// 			return;
// 		}
// 		console.log("Running Instance "+id);
// 		var task = rows[0];

// 		if (!modules[task.module]){
// 			return;
// 		}
// 		var meta = {};
// 		try {
// 			meta = JSON.parse(task.meta)
// 		}
// 		catch(err){
// 			return;
// 		}
// 		modules[task.module](input||{},meta,function(output){
// 			console.log("Instance "+id+" Done")
// 			// console.log(output);
// 			taskDone(id,output,res);
// 		})
// 	})
// }

// function taskDone(id,output,res){
// 	// Trigger Next

// 	if (!output){
// 		if (res && res.send){
// 			res.send("Task Ended With No Ouput")
// 		}
// 		return;
// 	}

// 	sql.do(`
// 		SELECT * FROM 
// 		chained_automation.loop_link
// 		WHERE from_loop_id=`+id+`
// 	`,function(rows){
// 		var tasks = rows;
// 		if (tasks.length==0){
// 			if (res && res.send){
// 				res.send(output);
// 			}
// 			return;
// 		};
// 		for (var i=0;i<tasks.length;i++){

// 			if (tasks[i].to_loop_id==0){
// 				if (res && res.send){
// 					res.send(output);
// 				}
// 			}
// 			else {
// 				console.log("Triggering Instance "+tasks[i].to_loop_id);
// 				run(tasks[i].to_loop_id,output,res);
// 			}

// 		}
// 	})
// }