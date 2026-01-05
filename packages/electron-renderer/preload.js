const { contextBridge, ipcRenderer } = require('electron');

// 通过 IPC 暴露给渲染进程
contextBridge.exposeInMainWorld('sdk', {
  createEngine: () => ipcRenderer.invoke('sdk:createEngine'),
  connect: () => ipcRenderer.invoke('sdk:connect'),
});


