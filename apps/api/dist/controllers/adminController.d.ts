import { Request, Response, NextFunction } from 'express';
export declare class AdminController {
    getIngestionStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    getReviewQueue(req: Request, res: Response, next: NextFunction): Promise<void>;
    approveReview(req: Request, res: Response, next: NextFunction): Promise<void>;
    rejectReview(req: Request, res: Response, next: NextFunction): Promise<void>;
    mergeDuplicate(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const adminController: AdminController;
