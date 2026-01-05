declare module '@rc/native' {
  export function helloWithCallback(
    name: string | undefined,
    cb: (message: string) => void
  ): void;
}


