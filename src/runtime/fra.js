import { BrowserWindow } from 'electron';


let appWindows = {};

module.exports = {
    create:function(project){
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
    }
}