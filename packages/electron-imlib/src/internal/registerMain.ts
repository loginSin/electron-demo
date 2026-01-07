declare function require(name: string): any;
import { RongIMClient } from '../RongIMClient';

export function registerMainHandlers(ipcMain: any, app: any): void {
  const fs = require('node:fs');
  const path = require('node:path');
  const sdkClient = RongIMClient.getInstance();

  // 统一的跨进程方法映射，后续新增接口只需补充到 map 中
  const methodMap: Record<string, (...args: any[]) => any> = {
    createEngine: () => {
      const userData = app.getPath('userData');
      const storePath = path.join(userData, 'database');
      try { fs.mkdirSync(storePath, { recursive: true }); } catch {}
      return sdkClient.createEngine(storePath);
    },
    connect: (token: string, timeout: number) => new Promise<{ code: number; userId: string }>((resolve) => {
      sdkClient.connect(token, timeout, (error: number, userId: string) => {
        // eslint-disable-next-line no-console
        console.log('RongIM connected user:', userId);
        resolve({ code: error, userId });
      });
    }),
  } as const;

  ipcMain.handle('sdk:invoke', (_event: any, method: keyof typeof methodMap, ...args: any[]) => {
    const fn = methodMap[method];
    if (!fn) {
      throw new Error(`Unknown SDK method: ${String(method)}`);
    }
    return fn(...args);
  });
}


