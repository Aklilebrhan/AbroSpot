import { Request, Response, NextFunction } from 'express';
export interface AuthUser {
    id: string;
    email: string;
    role: 'ADMIN' | 'CURATOR' | 'USER';
}
declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}
export declare function authenticate(req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
export declare function requireRole(...roles: ('ADMIN' | 'CURATOR' | 'USER')[]): (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
