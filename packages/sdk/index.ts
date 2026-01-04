export function sayHello(name?: string): string {
  const who = name && name.trim().length > 0 ? name : 'World';
  return `💡 Hello from SDK, ${who}!`;
}

