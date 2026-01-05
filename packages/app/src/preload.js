const { contextBridge, ipcRenderer } = require('electron');

// 将 SDK 方法通过 IPC 暴露给渲染进程（window.sdk.sayHello）
contextBridge.exposeInMainWorld('sdk', {
  sayHello: (name) => ipcRenderer.invoke('sdk:sayHello', name),
  // 将回调式方法包装为 Promise 返回，方便渲染进程使用
  sayHelloWithCallback: (name) => ipcRenderer.invoke('sdk:sayHelloWithCallback', name),
  nativeHello: (name) => ipcRenderer.invoke('sdk:nativeHello', name),
});
