import { ipcMain, WebContents, WebFrameMain } from "electron";
import { IEventPayloadMapping } from "../../../types.js";
import { isDevMode } from "./isDevMode.js";
import { getUIPath } from "./pathResolver.js";


export function ipcMainHandle<Key extends keyof IEventPayloadMapping>(
  key: Key,
  handler: () => IEventPayloadMapping[Key]
) {
  ipcMain.handle(key, (event) => {
    validateEventFrame(event.senderFrame)
    return handler()
  });
}

export function ipcWebContentSend<Key extends keyof IEventPayloadMapping>(
  key: Key,
  webContents: WebContents,
  payload: IEventPayloadMapping[Key]
) {
  webContents.send(key, payload);
}

function validateEventFrame(frame: WebFrameMain | null) {
  if (!frame) {
    throw new Error('Missing sender frame in IPC event');
  }
  console.log("Inside validation mode Frame", frame)
  console.log("Inside validation mode Frame.url", frame.url)
  if (isDevMode() && new URL(frame.url).host === 'localhost:5123') {
    return;
  }
  if(!frame.url.startsWith(getUIPath())) {
    throw new Error(`Not allowed to load URL ${frame.url} $ malacious Event`);
  }
}