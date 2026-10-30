import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
export declare const createSourceSchema: z.ZodObject<{
    body: z.ZodObject<{
        platform: z.ZodEnum<["TELEGRAM", "INSTAGRAM", "X_TWITTER", "TIKTOK", "LINKEDIN", "MANUAL"]>;
        identifier: z.ZodString;
        displayName: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        sourceUrl: z.ZodOptional<z.ZodString>;
        fetchFrequencyMinutes: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        platform: "TELEGRAM" | "INSTAGRAM" | "X_TWITTER" | "TIKTOK" | "LINKEDIN" | "MANUAL";
        identifier: string;
        displayName: string;
        description?: string | undefined;
        sourceUrl?: string | undefined;
        fetchFrequencyMinutes?: number | undefined;
    }, {
        platform: "TELEGRAM" | "INSTAGRAM" | "X_TWITTER" | "TIKTOK" | "LINKEDIN" | "MANUAL";
        identifier: string;
        displayName: string;
        description?: string | undefined;
        sourceUrl?: string | undefined;
        fetchFrequencyMinutes?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        platform: "TELEGRAM" | "INSTAGRAM" | "X_TWITTER" | "TIKTOK" | "LINKEDIN" | "MANUAL";
        identifier: string;
        displayName: string;
        description?: string | undefined;
        sourceUrl?: string | undefined;
        fetchFrequencyMinutes?: number | undefined;
    };
}, {
    body: {
        platform: "TELEGRAM" | "INSTAGRAM" | "X_TWITTER" | "TIKTOK" | "LINKEDIN" | "MANUAL";
        identifier: string;
        displayName: string;
        description?: string | undefined;
        sourceUrl?: string | undefined;
        fetchFrequencyMinutes?: number | undefined;
    };
}>;
export declare class SourceController {
    getSources(req: Request, res: Response, next: NextFunction): Promise<void>;
    createSource(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateSource(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteSource(req: Request, res: Response, next: NextFunction): Promise<void>;
    triggerIngestion(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const sourceController: SourceController;
