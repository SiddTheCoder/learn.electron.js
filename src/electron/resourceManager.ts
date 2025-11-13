import fs from "fs";
import os from "os";
import osUtils from "os-utils";
import { BrowserWindow } from "electron";
import { IstaticData } from "../../types.js";
import { ipcWebContentSend } from "./utils/ipcUtils.js";

const POLLING_INTERVAL = 500;

export function poolResources(mainWindow: BrowserWindow) {
  setInterval(async() => {
    let cpuUsage = await getCpuUsage()
    let ramUsage = getRamUsage()
    let storageData = getStorageData()
    ipcWebContentSend("statistics", mainWindow.webContents, { cpuUsage, ramUsage, storageData })
  }, POLLING_INTERVAL)
}

export function getStaticData(): IstaticData {
  const totalStorage = getStorageData().total;
  const cpuModel = os.cpus()[0].model;
  const cpuCores = os.cpus().length;
  const totalMemoryGB = Math.floor(osUtils.totalmem() / 1024);

  return {
    totalStorage,
    cpuModel,
    cpuCores,
    totalMemoryGB,
  };
}

function getCpuUsage() : Promise<number> {
  return new Promise((resolve) => {
    osUtils.cpuUsage(resolve)
  })
}

function getRamUsage() {
  return 1- osUtils.freememPercentage()
}

function getStorageData(): { total: number; free: number; usage: number } {
  const stats = fs.statfsSync(process.platform === "win32" ? "C://" : "/");
  const total = stats.blocks * stats.bsize;
  const free = stats.bfree * stats.bsize;
  return {
    total: Math.floor(total / 1024 / 1024),
    free,
    usage: 1 - free / total,
  };
}