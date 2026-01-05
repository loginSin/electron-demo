import * as native from '@rc/native';

export class RongIMClient {
  private enginePtr: bigint = 0n;

  private static instance: RongIMClient | null = null;

  private constructor() {}

  static getInstance(): RongIMClient {
    if (!RongIMClient.instance) {
      RongIMClient.instance = new RongIMClient();
    }
    return RongIMClient.instance;
  }

  /**
   * 原生方法包装：调用 @rc/native 的 createEngine
   */
  createEngine(storePath: string): void {
    this.enginePtr = native.createEngine(storePath);
    // eslint-disable-next-line no-console
    console.log('RongIM enginePtr:', this.enginePtr.toString());
  }

  connect(): void {
    native.connect(this.enginePtr);
  }
}


