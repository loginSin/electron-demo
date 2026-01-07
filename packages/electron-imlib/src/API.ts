import { getIpc } from './renderer';

export function createEngine(): Promise<void> {
    return getIpc().invoke('sdk:invoke', 'createEngine');
}

export function connect(token: string, timeout: number): Promise<{code: number, userId: string}> {
    return getIpc().invoke('sdk:invoke', 'connect', token, timeout);
}