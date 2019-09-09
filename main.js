const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");
const execa = require("execa");

let win;

function run_program() {
  (async () => {
    try {
      const { stdout } = await execa("client-rpc", ["--network-id", "ab"]);
    } catch (e) {
      console.log("client-rpc erorr " + e);
    }
  })();
}

function createWindow() {
  win = new BrowserWindow({ width: 1024, height: 768 });

  // load the dist folder from Angular
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  // The following is optional and will open the DevTools:
  // win.webContents.openDevTools()
  run_program();

  win.on("closed", () => {
    win = null;
  });
}

app.on("ready", createWindow);

// on macOS, closing the window doesn't quit the app
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    //app.quit();
    process.exit();
  }
});

// initialize the app's main window
app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
