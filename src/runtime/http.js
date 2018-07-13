let express = require("express");
let api = express();
let router = express.Router();
let bodyParser = require('body-parser');
let Notification = require("electron").Notification;
let cors = require("cors");

let APP_PATH = require("./path");
let task = require('./task');
let FRA = require("./fra");
let CDP = require("./cdp");

let db = require("./db");
let Queue = db.get("queue").write();
let Logs = db.get("logs").write();

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
      icon: APP_PATH.ICON_PATH,
      body: "The Loop Started Running Now"
    };
      
    let notification = new Notification(options);
    notification.show();
  }
  catch(err){
    console.log(err);
  }
  
	res.send("Triggered!");
})

router.post("/app",function(req,res){
  var project = req.body;
  FRA.create(project);
})

router.post("/cdp",function(req,res){
  CDP.run(req.body);
})

api.use(bodyParser.json())
api.use('/',router);
api.listen(10531);

module.exports = api;