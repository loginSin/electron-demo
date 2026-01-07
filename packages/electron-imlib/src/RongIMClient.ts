import { NativeClient } from "./internal/native/NativeClient";

export class RongIMClient {
  private readonly nativeClient: NativeClient = new NativeClient();

  private static instance: RongIMClient | null = null;

  private constructor() {}

  static getInstance(): RongIMClient {
    if (!RongIMClient.instance) {
      RongIMClient.instance = new RongIMClient();
    }
    return RongIMClient.instance;
  }

  createEngine(storePath: string): void {
    this.nativeClient.createEngine(storePath);
  }

  connect(token: string, timeout: number, callback: (error: number, userId: string) => void): void {
    this.nativeClient.connect(token, timeout, callback);
  }
}
