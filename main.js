const {app, BrowserWindow, globalShortcut} = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 1100,
    minHeight: 800,
    webPreferences: {nodeIntegration: true},
    autoHideMenuBar: true,
  });

  const refresh = globalShortcut.register("CommandOrControl+R", () => {
    // console.log('refresh')
    mainWindow.reload();
  });

  mainWindow.loadFile("index.html");

  mainWindow.on("closed", function() {
    mainWindow = null;
  });
}

app.on("ready", createWindow);
