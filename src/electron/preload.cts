import { IStatistics , IEventPayloadMapping} from "../../types";

const { electron, contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  subscribeStatistics: (callback) => 
    ipcOn("statistics", (stats) => {
      callback(stats);
    })
  ,
  getStaticData: () => ipcInvoke("getStaticData"),
  ping: () => ipcRenderer.invoke("ping"),
  poolResources: (mainWindow) => ipcInvoke("statistics", mainWindow),

} satisfies Window["electronAPI"]);                   

// client ipcUtils
function ipcInvoke<Key extends keyof IEventPayloadMapping>(key: Key, payload?: any) : Promise<IEventPayloadMapping[Key]> {
  return ipcRenderer.invoke(key, payload);
}

function ipcOn<Key extends keyof IEventPayloadMapping>(
  key: Key,
  callback: (payload: IEventPayloadMapping[Key]
  ) => void) {
  //cbfun callbackFunction
  const cbfun = (_event: any, payload: IEventPayloadMapping[Key]) => callback(payload)
  ipcRenderer.on(key, cbfun);
  return () => ipcRenderer.off(key, cbfun);
}