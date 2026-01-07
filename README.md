# 项目介绍

本项目是一个 Electron 项目，用于开发一个跨平台的 IM 应用。

## 项目结构

```
├── packages
│   ├── app               # 应用主包
│   ├── electron-imlib    # 跨平台 IM 库
│   ├── electron-native   # 原生代码包
│   ├── electron-renderer # renderer 进程方法白名单
```

## 项目运行

1. 将 Rust .a 放到指定路径

手动编译 Rust mac arm64 和 x86_64 的库，并复制到 electron-native/libs/ 目录下

```

packages/electron-native/libs
└── mac
    ├── CHANGELOG.md
    ├── arm64
    │   └── librust_universal_imsdk.a
    ├── include
    │   └── rcim_client.h
    └── x86_64
        └── librust_universal_imsdk.a
```

2. 安装依赖
```bash
npm install
```

3. 运行应用
```bash
npm start
```

# 实现原理

electron 分为 renderer 进程和主进程，有方法白名单机制，只有白名单中的方法才能在 renderer 进程中调用。

```
renderer 进程：用于渲染 UI，各种 html 文件都在该进程中渲染

preload.js 是运行在 Renderer 进程里的“安全中间层”，`方法白名单`，把 Main 的能力，以受控、安全的方式暴露给 UI（Renderer）

main 进程：用于管理主进程，管理各种原生模块
```

1. 在 Renderer 进程中，通过 electron-renderer/preload.js `加载` Main 进程中的方法

```javascript
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: require.resolve('@rc/electron-renderer'), // 指定 preload.js 文件
      // 允许渲染进程直接 require 使用 @rc/sdk 导出的 API
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};
```

2. 在 Main 进程中，通过 electron-imlib/registerMain.ts 注册 IPC 事件

```typescript
app.whenReady().then(() => {
  createWindow();

  const { registerMainHandlers } = require('@rc/sdk/registerMain');
  registerMainHandlers(ipcMain, app);


  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
```


# 调用链路


```
1. app/index.js 处于 renderer 进程，响应 UI 事件，调用 RongIMClient 的各种方法

2. electron-imlib/RongIMClient.ts 处于 renderer 进程，内部通过 ipc.invoke 进入主进程

3. electron-imlib/registerMain.ts 处于 main 进程，接收 renderer 事件 ，调用 NativeClient 的各种方法，重要：将 native 的 callback 转为 Promise

4. electron-imlib/NativeClient.ts 处于 main 进程，内部通过 native 方法调用 native 库

5. electron-native/types.d.ts 处于 main 进程，定义 native 方法的类型

6. electron-native/main.cc 处于 main 进程，注册 native 方法的映射关系

7. electron-native/xxx.cc 处于 main 进程，真正实现 native 方法
```


> 新增 native 方法实现步骤

```
1. binding.gyp 实现 native 方法的绑定，其作用类似于 CMakeLists.txt

2. electron-native/src/xxx.cc 实现 native 方法，可以参考 init.cc 和 connect.cc

3. 新增的 native 方法在 main.cc 中注册

4. electron-native/types.d.ts 导出 js 格式的 native 方法
```

# todo

连接监听

ipc 跨进程方法进行统一