const { contextBridge, ipcRenderer } = require('electron');

// 将 SDK 方法通过 IPC 暴露给渲染进程（window.sdk.sayHello）
contextBridge.exposeInMainWorld('sdk', {
  sayHello: (name) => ipcRenderer.invoke('sdk:sayHello', name),
});
