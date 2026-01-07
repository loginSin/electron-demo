import * as native from '@rc/native';

/// 负责对 @rc/native 的封装，提供给 RongIMClient 使用
// Todo qixinbing 待实现初始化检查注解，参数合法性检查
export class NativeClient {
  /// rust 引擎指针
  private enginePtr: bigint = 0n;

  private static instance: NativeClient | null = null;

  private constructor() {}

  static getInstance(): NativeClient {
    if (!NativeClient.instance) {
      NativeClient.instance = new NativeClient();
    }
    return NativeClient.instance;
  }

  /**
   * 原生方法包装：调用 @rc/native 的 init
   */
  init(storePath: string): void {
    this.enginePtr = native.init(storePath);
    // eslint-disable-next-line no-console
    console.log('RongIM enginePtr:', this.enginePtr.toString());
  }

  connect(token: string, timeout: number, callback: (error: number, userId: string) => void): void {
    native.connect(this.enginePtr, token, timeout, callback);
  }
}