let Notification = require("electron").Notification;
let socket = require('socket.io-client')('http://45.76.223.40:3000');
let task = require('./task');
let APP_PATH = require("./path");
let db = require("./db");

// Doing Socket Connection
socket.on('connect', function(){
	console.log("Connected With TIA Server");
	// socket.emit("join",{
  //   deviceId:"tia-pc-tony"
	// })
});

socket.on('message',function(data){
  // console.log(data);
  if (data.zone_id){
    console.log("Incoming Remote Task")
    try {
      task.run(data);
      let options = {
        title:"A Remote Task Arrived",
        icon: APP_PATH.ICON_PATH,
        body: "The Loop Started Running Now"
      };

      let notification = new Notification(options);
      notification.show();

    }
    catch(err){
      console.log(err);
    }
  }
})

socket.on("request",function(data){
  var request = data.body;

  console.log("A Socket Request Coming In, Handling")

  socketHandle(request,function(response){
    socket.emit("response",{
      id:data.id,
      data:response
    })
  })

  
})



function socketHandle(req,res){

  if (req.type=='executing'){
    res(db.get("executing").value())
  }
  else if(req.type=='ping'){
    res('pong')
  }
  else if(req.type=='queue'){
    res(db.get("queue").value())
  }
  else {
    res(false)
  }

}

module.exports = socket;