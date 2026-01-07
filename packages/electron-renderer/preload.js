const { contextBridge, ipcRenderer } = require('electron');

const bridge = {
  init: () => ipcRenderer.invoke('sdk:invoke', 'init'),
  connect: (token, timeout) => ipcRenderer.invoke('sdk:invoke', 'connect', token, timeout),
};

// 在禁用 contextIsolation 的场景，不能使用 contextBridge
if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('sdk', bridge);
} else {
  // 直接挂到 window，便于渲染进程访问
  window.sdk = bridge;
}


