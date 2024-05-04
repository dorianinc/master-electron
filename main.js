const { app, BrowserWindow, session } = require("electron");
const windowStateKeeper = require("electron-window-state");

let mainWindow;

function createWindow() {
  let sesh = session.defaultSession;

  let getGalletas = () => {
    sesh.cookies
      .get({})
      .then((galleta) => {
        console.log("🖥️  galleta: ", galleta);
      })
      .catch((err) => {
        console.log("🖥️  err: ", err);
      });
  };


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

  mainWindowState.manage(mainWindow);
  mainWindow.loadURL("https://github.com")
  // mainWindow.loadFile("./index.html");

  mainWindow.webContents.on("did-finish-load", e => {
    getGalletas()
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
