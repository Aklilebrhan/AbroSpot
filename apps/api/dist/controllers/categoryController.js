"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = exports.CategoryController = void 0;
const database_1 = require("@abrospot/database");
const cacheService_js_1 = require("../services/cacheService.js");
class CategoryController {
    async getCategories(req, res, next) {
        try {
            const cacheKey = 'categories:all';
            const cached = await cacheService_js_1.cache.get(cacheKey);
            if (cached)
                return res.json(cached);
            const categories = await database_1.prisma.eventCategory.findMany({
                orderBy: { displayOrder: 'asc' },
                include: {
                    _count: {
                        select: { events: true },
                    },
                },
            });
            await cacheService_js_1.cache.set(cacheKey, categories, 600); // 10 mins
            res.json(categories);
        }
        catch (e) {
            next(e);
        }
    }
    async getCategoryBySlug(req, res, next) {
        try {
            const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
            const category = await database_1.prisma.eventCategory.findUnique({
                where: { slug },
                include: {
                    events: {
                        where: { status: 'PUBLISHED' },
                        take: 12,
                        include: {
                            location: true,
                            occurrences: true,
                            media: { where: { isPrimaryFlyer: true } },
                        },
                    },
                },
            });
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.json(category);
        }
        catch (e) {
            next(e);
        }
    }
}
exports.CategoryController = CategoryController;
exports.categoryController = new CategoryController();
