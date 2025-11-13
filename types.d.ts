// /types.d.ts
import { BrowserWindow } from "electron";

type IStatistics = {
  cpuUsage: number
  ramUsage :  number
  storageData :  {total: number; free: number; usage: number;}
}

type IstaticData =  {
  totalStorage: number
  cpuModel: string
  cpuCores: number
  totalMemoryGB: number
}

type IPing = {
  message: string
}

type IEventPayloadMapping = {
  statistics: IStatistics;
  getStaticData: IstaticData;
  ping : IPing
}

type unSubscribeFunction = () => void

declare global {
  interface Window {
    electronAPI: {
      subscribeStatistics: (
        callback: (statistics: IStatistics) => void
      ) => unSubscribeFunction;
      getStaticData: () => Promise<IstaticData>;
      poolResources: (mainWindow: BrowserWindow) => void;
      ping: () => Promise<any>;
    };
  }
}