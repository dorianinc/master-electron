// Modules
const { app, BrowserWindow, webContents } = require("electron");
const windowStateKeeper = require("electron-window-state");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
setTimeout(() => {
  console.log("Checking ready: " + app.isReady());
}, 2000);

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

  mainWindowState.manage(mainWindow);
  // mainWindow.loadFile("index.html");
  mainWindow.loadURL("https://httpbin.org/basic-auth/user/passwd");
  // Listen for window being closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  let wc = mainWindow.webContents;

  wc.on("did-finish-load", () => {
    console.log("content fully loaded");
  });

  wc.on("dom-ready", () => {
    console.log("dom is ready");
  });

  wc.setWindowOpenHandler((details) => {
    console.log("🖥️  details: ", details.url);
    return { action: "allow" };
  });

  wc.on("before-input-event", (e, input) => {
    console.log(`${input.key}: ${input.type}`);
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
