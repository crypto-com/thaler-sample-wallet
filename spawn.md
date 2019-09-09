
# Electron Spawning Process

## Two processes
* Main  
  launching browser, you can use any nodejs api.   
  it's full control
  can use native api

* Renderer  
  inside browser v8 runtime.
  it's limited control.  
  cannot use native directly    

## Yarn setup
1. Install yarn in nodejs  
    sudo npm -g install yarn
2. Create electron app  
    yarn create electron-app my-app  
    cd my-app  
3. Run the program  
    yarn start  
4. Package the program  
     yarn make  

## Spawn Process    
1. Add package     
    yarn add execa    
2. Open source   
    cd src  
   code index.js   
3. Spawn the process   
```
const { app, BrowserWindow } = require("electron");
const { exec } = require("child_process");
const execa = require("execa");

if (require("electron-squirrel-startup")) {
  app.quit();
}

function run_program() {
  (async () => {
    const { stdout } = await execa("/usr/local/bin/client-rpc", [
      "--network-id",
      "ab"
    ]);
  })();
}

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });

  run_program();

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

```