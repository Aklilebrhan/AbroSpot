export declare class AIClientService {
    private client;
    checkHealth(): Promise<any>;
    checkAdaptersStatus(): Promise<any>;
    triggerSourceIngestion(platform: string, identifier: string, limit?: number): Promise<any>;
    normalizeDate(text: string): Promise<any>;
    extractFromPost(rawPost: any, ocrText?: string): Promise<any>;
    checkDeduplication(candidate: any, existingEvents: any[]): Promise<any>;
}
export declare const aiClient: AIClientService;
