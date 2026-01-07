/**
 * Renderer-side SDK entry.
 * Exposes high-level methods that hide IPC details from the caller.
 */
declare function require(name: string): any;

type IPCInvoker = (...args: any[]) => Promise<any>;

export const getIpc = () => {
  try {
    // `require` is available because the renderer is created with nodeIntegration.
    // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
    const { ipcRenderer } = require('electron');
    if (!ipcRenderer) {
      throw new Error('ipcRenderer is not available in this context.');
    }
    return ipcRenderer as {
      invoke: IPCInvoker
    };
  } catch (err) {
    throw new Error(`ipcRenderer unavailable: ${err instanceof Error ? err.message : String(err)}`);
  }
};

