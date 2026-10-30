import { Request, Response, NextFunction } from 'express';
export declare class CategoryController {
    getCategories(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getCategoryBySlug(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const categoryController: CategoryController;
