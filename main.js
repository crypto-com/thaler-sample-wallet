const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");
const execa = require("execa");

let win;

async function run_program(
  network_type,
  network_id,
  tendermint_url,
  websocket_url
) {
  try {
    console.log(
      `run client-rpc network_type=${network_type} network_id=${network_id} tendermint=${tendermint_url} websocket=${websocket_url}`
    );
    const { stdout } = await execa("client-rpc", [
      "--network-type",
      network_type,
      "--network-id",
      network_id,
      "--tendermint-url",
      tendermint_url,
      "--websocket-url",
      websocket_url
    ]);
  } catch (e) {
    console.log("client-rpc erorr " + e);
  }
}

function createWindow() {
  var args = process.argv;
  console.log(args);
  var i;

  var network_type = "test";
  var network_id = "42";
  var tendermint_url = "http://localhost:26657/";
  var websocket_url = "ws://localhost:26657/websocket";
  var debug = false;

  for (i = 0; i < args.length; i++) {
    if (i < args.length - 1)
      if (args[i] == "-n" || args[i] == "--network-id") {
        console.log("network id=", args[i + 1]);
        network_id = args[i + 1];
      }

    if (i < args.length - 1)
      if (args[i] == "-i" || args[i] == "--network-type") {
        console.log("network type=", args[i + 1]);
        network_type = args[i + 1];
      }

    if (i < args.length - 1)
      if (args[i] == "-t" || args[i] == "--tendermint-url") {
        console.log("tendermint url=", args[i + 1]);
        tendermint_url = args[i + 1];
      }

    if (i < args.length - 1)
      if (args[i] == "-w" || args[i] == "--websocket-url") {
        console.log("websocket url=", args[i + 1]);
        websocket_url = args[i + 1];
      }

    if (args[i] == "-d" || args[i] == "--debug") {
      debug = true;
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
  // The following is optional and will open the DevTools
  if (debug) win.webContents.openDevTools();
  run_program(network_type, network_id, tendermint_url, websocket_url);

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
