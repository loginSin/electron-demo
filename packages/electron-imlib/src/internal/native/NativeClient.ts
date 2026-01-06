import * as native from '@rc/native';

/// 负责对 @rc/native 的封装，提供给 RongIMClient 使用
// Todo qixinbing 待实现初始化检查注解，参数合法性检查
export class NativeClient {
  private enginePtr: bigint = 0n;

  /**
   * 原生方法包装：调用 @rc/native 的 createEngine
   */
  createEngine(storePath: string): void {
    this.enginePtr = native.createEngine(storePath);
    // eslint-disable-next-line no-console
    console.log('RongIM enginePtr:', this.enginePtr.toString());
  }

  connect(token: string, timeout: number, callback: (error: number, userId: string) => void): void {
    native.connect(this.enginePtr, token, timeout, callback);
  }
}