import { SourcePlatform, SourceStatus } from '@abrospot/database';
export interface CreateSourceDto {
    platform: SourcePlatform;
    identifier: string;
    displayName: string;
    description?: string;
    sourceUrl?: string;
    fetchFrequencyMinutes?: number;
}
export declare class SourceService {
    getSources(): Promise<({
        _count: {
            posts: number;
            ingestionJobs: number;
        };
    } & {
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
    })[]>;
    createSource(dto: CreateSourceDto): Promise<{
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
    }>;
    updateSource(id: string, data: Partial<CreateSourceDto> & {
        status?: SourceStatus;
    }): Promise<{
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
    }>;
    deleteSource(id: string): Promise<{
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
    }>;
    triggerIngestion(id: string): Promise<any>;
}
export declare const sourceService: SourceService;
