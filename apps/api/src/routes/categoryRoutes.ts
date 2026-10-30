import { Router } from 'express';
import { categoryController } from '../controllers/categoryController.js';

export const categoryRouter = Router();

categoryRouter.get('/', (req, res, next) => categoryController.getCategories(req, res, next));
categoryRouter.get('/:slug', (req, res, next) => categoryController.getCategoryBySlug(req, res, next));
