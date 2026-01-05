declare function require(name: string): any;
import { RongIMClient } from './RongIMClient';

export function registerMainHandlers(ipcMain: any, app: any): void {
  const fs = require('node:fs');
  const path = require('node:path');
  const sdkClient = RongIMClient.getInstance();

  ipcMain.handle('sdk:createEngine', () => {
    const userData = app.getPath('userData');
    const storePath = path.join(userData, 'database');
    try { fs.mkdirSync(storePath, { recursive: true }); } catch {}
    return sdkClient.createEngine(storePath);
  });

  ipcMain.handle('sdk:connect', (_event: any, token: string, timeout: number) => {
    return new Promise<{ code: number; userId: string }>((resolve) => {
      sdkClient.connect(token, timeout, (error: number, userId: string) => {
          // eslint-disable-next-line no-console
          console.log('RongIM connected user:', userId);
        resolve({ "code": error, "userId": userId });
      });
    });
  });
}


