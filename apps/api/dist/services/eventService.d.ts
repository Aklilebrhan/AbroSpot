export interface EventFilterOptions {
    page?: number;
    limit?: number;
    category?: string;
    subCity?: string;
    isFeatured?: boolean;
    startDate?: string;
    endDate?: string;
    search?: string;
}
export declare class EventService {
    getEvents(options: EventFilterOptions): Promise<{}>;
    getUpcomingEvents(limit?: number): Promise<{}>;
    getEventByIdOrSlug(idOrSlug: string): Promise<{} | null>;
    getEventSources(eventId: string): Promise<({
        monitoredSource: {
            id: string;
            description: string | null;
            status: import(".prisma/client").$Enums.SourceStatus;
            createdAt: Date;
            updatedAt: Date;
            platform: import(".prisma/client").$Enums.SourcePlatform;
            identifier: string;
            displayName: string;
            avatarUrl: string | null;
            sourceUrl: string | null;
            fetchFrequencyMinutes: number;
            lastFetchedAt: Date | null;
            lastPostIdentifier: string | null;
            errorCount: number;
            lastErrorMessage: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        } | null;
        extractionResult: {
            id: string;
            confidenceScore: number;
            requiresReview: boolean;
            createdAt: Date;
            sourcePostId: string;
            isEvent: boolean;
            ocrAmharicText: string | null;
            ocrEnglishText: string | null;
            fullExtractedText: string | null;
            detectedLanguage: import(".prisma/client").$Enums.LanguageCode;
            extractedJson: import("@prisma/client/runtime/library").JsonValue;
            validationErrors: import("@prisma/client/runtime/library").JsonValue | null;
            missingFields: string[];
            reviewReason: import(".prisma/client").$Enums.ReviewReason | null;
            modelEngine: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        monitoredSourceId: string | null;
        platform: import(".prisma/client").$Enums.SourcePlatform;
        externalPostId: string;
        postUrl: string | null;
        authorUsername: string | null;
        publishedAt: Date;
        rawText: string | null;
        rawPayload: import("@prisma/client/runtime/library").JsonValue;
        mediaUrls: string[];
        processingStatus: import(".prisma/client").$Enums.PostProcessingStatus;
        canonicalEventId: string | null;
        duplicateOfPostId: string | null;
    })[]>;
}
export declare const eventService: EventService;
