import { clipboard, app, BrowserWindow, Tray, Menu, Notification } from 'electron';
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let tray;

let socket = require('./runtime/socket');
let http = require('./runtime/http');
let APP_PATH = require('./runtime/path');
let dir = require('./runtime/dir');

dir.init();
// app.commandLine.appendSwitch('remote-debugging-port', '9222')

const createTray = () => {
  
  let isWin = process.platform === "win32";

  if (isWin){
    tray = new Tray(APP_PATH.ICON_PATH);
  }
  else {
    app.dock.hide();
    tray = new Tray(APP_PATH.MAC_TRAY_PATH);
  }

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

let shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {});

if (shouldQuit) {
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function(){
  
  createTray();
});

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
    // createWindow();
  }
});

process.on('uncaughtException', function (error) {
  // Handle the error
  console.error(error);
})