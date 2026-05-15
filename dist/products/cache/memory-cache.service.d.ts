export declare class MemoryCacheService {
    private readonly logger;
    private cache;
    private readonly TTL;
    get(key: string): any | null;
    set(key: string, data: any): void;
    clear(): void;
    getStats(): {
        size: number;
        keys: string[];
    };
}
