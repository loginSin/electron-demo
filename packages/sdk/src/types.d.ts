declare module '@app/native' {
  export function helloWithCallback(
    name: string | undefined,
    cb: (message: string) => void
  ): void;
}


