// Modules
const { app, BrowserWindow } = require("electron");
const windowStateKeeper = require("electron-window-state");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
setTimeout(() => {
  console.log("Checking ready: " + app.isReady());
}, 2000);

let mainWindow, secondaryWindow;

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
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      nodeIntegration: true,
    },
    // show: false
    // frame: false
  });

  secondaryWindow = new BrowserWindow({
    width: 600,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
    },
    parent: mainWindow,
    modal: true,
    show: false,
  });

  mainWindowState.manage(mainWindow);

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile("index.html");
  secondaryWindow.loadFile("secondary.html");

  // setTimeout(() => {
  //   secondaryWindow.show();
  //   setTimeout(() => {
  //     secondaryWindow.close();
  //     secondaryWindow = null;
  //   }, 3000);
  // }, 2000);

  // Open DevTools - Remove for PRODUCTION!
  // mainWindow.webContents.openDevTools();

  // mainWindow.once("ready-to-show", mainWindow.show)

  // Listen for window being closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // secondaryWindow.on("closed", () => {
  //   secondaryWindow = null;
  // });
}

// app.on("before-quit", e => {
//   console.log("Preventing app is quitting")
//   // e.preventDefault()
// })

// app.on("browser-window-blur", () => {
//   console.log("browser window blurred")
//   setTimeout(() => {
//     app.quit()
//   }, 3000)
// })

// app.on("browser-window-focus", () => {
//   console.log("browser window focused")
// })

// Electron `app` is ready
app.on("ready", () => {
  // console.log("app is ready")
  // console.log("desktop => ", app.getPath("desktop"))
  // console.log("music => ", app.getPath("music"))
  // console.log("temp => ", app.getPath("temp"))
  // console.log("home => ", app.getPath("userData"))

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
