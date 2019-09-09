const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");
const execa = require("execa");

let win;

function run_program(network_type, network_id) {
  (async () => {
    try {
      console.log(`run client-rpc ${network_type}-${network_id}`);
      const { stdout } = await execa("client-rpc", [
        "--network-type",
        network_type,
        "--network-id",
        network_id
      ]);
    } catch (e) {
      console.log("client-rpc erorr " + e);
    }
  })();
}

function createWindow() {
  var args = process.argv;
  var i;

  var network_type = "test";
  var network_id = "42";

  for (i = 0; i < args.length - 1; i++) {
    if (args[i] == "-n" || args[i] == "--network-id") {
      console.log("network id=", args[i + 1]);
      network_id = args[i + 1];
    }
    if (args[i] == "-i" || args[i] == "--network-type") {
      console.log("network type=", args[i + 1]);
      network_type = args[i + 1];
    }
  }

  console.log(process.argv);

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
  win.webContents.openDevTools();
  run_program(network_type, network_id);

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
