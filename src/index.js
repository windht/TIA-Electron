import { clipboard, app, BrowserWindow, Tray, Menu, Notification } from 'electron';
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let appWindows = {};
let mainWindow;
let tray;
let express = require('express');
let api = express();
let router = express.Router();
let bodyParser = require('body-parser');
let ejs = require('ejs');
let path = require('path');
let cors = require('cors');
let task = require('./task');
let iconPath = path.join(__dirname,'icon.png');
let trayPath = path.join(__dirname,'icon_16x16.png');
let fs = require('fs');

let TIA_TEMP_DIR = path.join(app.getPath("temp"),"TIA_TEMP")
let TIA_HOME_DIR = path.join(app.getPath('home'),"TIA");

let socket = require('socket.io-client')('http://45.76.223.40:3000');



// app.commandLine.appendSwitch('remote-debugging-port', '9222')

const createWindow = () => {
  // Create the browser window.
  // mainWindow = new BrowserWindow({
  //   width: 800,
  //   height: 600,
  //   // show:false
  // });

  // // and load the index.html of the app.
  // mainWindow.loadURL(`file://${__dirname}/index.html`);

  // // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // // Emitted when the window is closed.
  // mainWindow.on('closed', () => {
  //   // Dereference the window object, usually you would store windows
  //   // in an array if your app supports multi windows, this is the time
  //   // when you should delete the corresponding element.
  //   mainWindow = null;
  // });
  app.dock.hide();
  tray = new Tray(trayPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Get TIA Machine ID',
      click:function(){
        if (socket.id){
          clipboard.writeText(socket.id)
        }
      }
    },
    {
      label: 'TIA Is Running In The Background',
    },
    {type: 'separator'},
    {
      label: 'TIA V1.0.0',
      disabled:true
    },
    {role: 'quit'}
  ])
  tray.setToolTip('TIA By The Builder')
  tray.setContextMenu(contextMenu)
};

var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
  // Someone tried to run a second instance, we should focus our window.
  // if (myWindow) {
  //   if (myWindow.isMinimized()) myWindow.restore();
  //   myWindow.focus();
  // }
});

if (shouldQuit) {
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    // app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

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
    var options = {
      title:"TIA New Loop",
      icon: iconPath,
      body: "The Loop Started Running Now"
    };
      
    var notification = new Notification(options);
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


// Create The Home Dir For TIA
if (!fs.existsSync(TIA_HOME_DIR)){
  console.log("TIA Home DIR Not Exists, Creating")
  fs.mkdirSync(TIA_HOME_DIR);
}
else {
  console.log("TIA Home DIR Exists, Jumping")
}
    
if (!fs.existsSync(TIA_TEMP_DIR)){
  console.log("TEMP DIR Not Exists, Creating")
  fs.mkdirSync(TIA_TEMP_DIR);
}
else {
  console.log("TEMP DIR Exists, Jumping")
}


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
      var options = {
        title:"A Remote Task Arrived",
        icon: iconPath,
        body: "The Loop Started Running Now"
      };

      var notification = new Notification(options);
      notification.show();

    }
    catch(err){
      console.log(err);
    }
  }
})


process.on('uncaughtException', function (error) {
  // Handle the error
  console.error(error);
})