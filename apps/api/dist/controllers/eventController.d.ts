import { Request, Response, NextFunction } from 'express';
export declare class EventController {
    getEvents(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUpcoming(req: Request, res: Response, next: NextFunction): Promise<void>;
    getEventById(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getEventSources(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const eventController: EventController;
