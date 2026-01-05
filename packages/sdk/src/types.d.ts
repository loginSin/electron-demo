declare module '@rc/native' {
  export function createEngine(storePath: string): bigint;
  export function connect(engine: bigint): void;
}


