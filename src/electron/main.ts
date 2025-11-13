import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "node:path";
import { isDevMode } from "./utils/isDevMode.js";
import { getStaticData, poolResources } from "./resourceManager.js";
import { getPreloadPath } from "./utils/pathResolver.js";
import {ipcMainHandle} from "./utils/ipcUtils.js";

app.on("ready", () => {
  console.log("App ready!");
  console.log("app path:", app.getAppPath());

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: getPreloadPath(),
    }
  });

 
  if (isDevMode()) {
    console.log("dev mode");
    mainWindow.loadURL("http://localhost:5123");
  } else {
    console.log("prod mode");
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }
  
  // hitting system api now from main to renderer
  poolResources(mainWindow)

  // custom ipcmainHandle with typesafty
  ipcMainHandle("getStaticData", () => getStaticData())

  // custom ipcmainHandle with typesafty
  ipcMainHandle("ping", () => {
    return {
      message : "pong"
    }
  })

});
