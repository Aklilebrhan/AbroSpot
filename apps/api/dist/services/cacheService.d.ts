declare class CacheService {
    private client;
    private memoryFallback;
    private isConnected;
    constructor();
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: any, ttlSeconds?: number): Promise<void>;
    del(keyPattern: string): Promise<void>;
}
export declare const cache: CacheService;
export {};
