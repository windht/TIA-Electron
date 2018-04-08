let socket = require('socket.io-client')('http://45.76.223.40:3000');
let task = require('./task');
let APP_PATH = require("./path");
let Notification = require("electron").Notification;

// Doing Socket Connection
socket.on('connect', function(){
	console.log("Connected With TIA Server");
	// socket.emit("join",{
	// 	deviceId:"tia-pc-"
	// })
});

socket.on('message',function(data){
  console.log(data);
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

module.exports = socket;