// Modules
const { app, BrowserWindow, webContents } = require("electron");
const windowStateKeeper = require("electron-window-state");

let mainWindow;

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800,
  });
  
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    webPreferences: {
      nodeIntegration: true,
    },
    alwaysOnTop: true,
  });
  let wc = mainWindow.webContents;
  mainWindowState.manage(mainWindow);
  mainWindow.loadFile("./index.html")
  
  wc.on("media-started-playing", () => {
    console.log("video started playing")
  })

  wc.on("media-paused", () => {
    console.log("video paused")
  })

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Electron `app` is ready
app.on("ready", () => {
  createWindow();
});

// Quit when all windows are closed - (Not macOS - Darwin)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
