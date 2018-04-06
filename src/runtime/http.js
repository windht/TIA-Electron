let express = require("express");
let api = express();
let router = express.Router();
let bodyParser = require('body-parser');
let task = require('./task');
let Notification = require("electron").Notification;
let cors = require("cors");

router.options('/*',cors())
router.post('/*',cors());
router.get('/*',cors());
router.put('/*',cors());
router.delete('/*',cors());

router.get("/",function(req,res){
  res.send("Status Fine")
});

router.post("/zone",function(req,res){
  // console.log(req.body);
  try {
    task.run(req.body);
    let options = {
      title:"TIA New Loop",
      icon: iconPath,
      body: "The Loop Started Running Now"
    };
      
    let notification = new Notification(options);
    notification.show();
  }
  catch(err){
    console.log(err);
  }
	
	res.send("Triggered!");

	// Notification
	
	// notification.on('show',function () {
	//   setTimeout(function() {notification.close();}, 2000);
	// })
})

router.post("/app",function(req,res){
  var project = req.body;
  if (!appWindows[project.objectId]){
    appWindows[project.objectId] = new BrowserWindow(project.data.window);
    appWindows[project.objectId].loadURL('https://thebuilder.hk/board/desktop?project_id='+project.objectId);
    appWindows[project.objectId].on('closed', () => {
      appWindows[project.objectId] = null;
    });
  }
  else {
    appWindows[project.objectId].loadURL('https://thebuilder.hk/board/desktop?project_id='+project.objectId);
  }

  if (project.data.debug){
    appWindows[project.objectId].webContents.openDevTools();
  }
})

api.use(bodyParser.json())
api.use('/',router);
api.listen(10531);

module.exports = api;