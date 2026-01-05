import * as native from '@rc/native';

export class RongIMClient {
  private static instance: RongIMClient | null = null;
  static getInstance(): RongIMClient {
    if (!RongIMClient.instance) {
      RongIMClient.instance = new RongIMClient();
    }
    return RongIMClient.instance;
  }

  private constructor() {}

  private enginePtr: bigint = 0n;

  sayHello(name?: string): string {
    const who = name && name.trim().length > 0 ? name : 'World';
    return `💡 Hello from SDK, ${who}!`;
  }

  /**
   * 原生方法包装：调用 @rc/native 的 createEngine
   */
  createEngine(storePath: string): void {
    // 由 APP 主进程传入 userData 路径（如 app.getPath('userData')/database）
    this.enginePtr = native.createEngine(storePath);
    // 打印 enginePtr 句柄（BigInt）
    // eslint-disable-next-line no-console
    console.log('RongIM enginePtr:', this.enginePtr.toString());
    console.log('RongIM storePath:', storePath);
  }

  connect(): void {
    native.connect(this.enginePtr);
  }

}

