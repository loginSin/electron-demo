import { getIpc } from './internal/renderer';

export class RongIMClient {
    private static instance: RongIMClient | null = null;

    static getInstance(): RongIMClient {
        if (!RongIMClient.instance) {
            RongIMClient.instance = new RongIMClient();
        }
        return RongIMClient.instance;
    }

    static init(): Promise<void> {
        return getIpc().invoke('sdk:invoke', 'init');
    }

    connect(token: string, timeout: number): Promise<{code: number, userId: string}> {
        return getIpc().invoke('sdk:invoke', 'connect', token, timeout);
    }
}