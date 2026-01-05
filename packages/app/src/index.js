const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { RongIMClient } = require('@app/sdk');
const sdkClient = new RongIMClient();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Use SDK: set window title with SDK message
  const title = sdkClient.sayHello('Electron');
  mainWindow.setTitle(title);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // Expose SDK via IPC for renderer (preload will call this)
  ipcMain.handle('sdk:sayHello', (_event, name) => {
    return sdkClient.sayHello(name);
  });

  // Expose callback-style method via IPC; convert callback to Promise result
  ipcMain.handle('sdk:sayHelloWithCallback', (_event, name) => {
    return new Promise((resolve) => {
      sdkClient.sayHelloWithCallback(name, (message) => {
        resolve(message);
      });
    });
  });

  // Native-backed method via SDK
  ipcMain.handle('sdk:nativeHello', (_event, name) => {
    return new Promise((resolve) => {
      sdkClient.nativeHello(name, (message) => {
        resolve(message);
      });
    });
  });

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
