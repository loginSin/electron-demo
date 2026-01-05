export class RongIMClient {
  sayHello(name?: string): string {
    const who = name && name.trim().length > 0 ? name : 'World';
    return `💡 Hello from SDK, ${who}!`;
  }

  /**
   * 带回调的示例方法：计算问候语后，通过回调返回结果
   */
  sayHelloWithCallback(
    name: string | undefined,
    callback: (message: string) => void
  ): void {
    const who = name && name.trim().length > 0 ? name : 'World';
    const message = `🔔 Hello (callback) from SDK, ${who}!`;
    // 模拟异步回调
    setTimeout(() => callback(message), 0);
  }
}

