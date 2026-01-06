declare module '@rc/native' {
  export function createEngine(storePath: string): bigint;
  export function connect(engine: bigint, token: string, timeout: number, callback: (error: number, userId: string) => void): void;
}


