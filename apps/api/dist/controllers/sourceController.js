"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sourceController = exports.SourceController = exports.createSourceSchema = void 0;
const sourceService_js_1 = require("../services/sourceService.js");
const zod_1 = require("zod");
exports.createSourceSchema = zod_1.z.object({
    body: zod_1.z.object({
        platform: zod_1.z.enum(['TELEGRAM', 'INSTAGRAM', 'X_TWITTER', 'TIKTOK', 'LINKEDIN', 'MANUAL']),
        identifier: zod_1.z.string().min(2),
        displayName: zod_1.z.string().min(2),
        description: zod_1.z.string().optional(),
        sourceUrl: zod_1.z.string().url().optional(),
        fetchFrequencyMinutes: zod_1.z.number().int().min(5).max(1440).optional(),
    }),
});
class SourceController {
    async getSources(req, res, next) {
        try {
            const sources = await sourceService_js_1.sourceService.getSources();
            res.json(sources);
        }
        catch (e) {
            next(e);
        }
    }
    async createSource(req, res, next) {
        try {
            const source = await sourceService_js_1.sourceService.createSource(req.body);
            res.status(201).json(source);
        }
        catch (e) {
            next(e);
        }
    }
    async updateSource(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const updated = await sourceService_js_1.sourceService.updateSource(id, req.body);
            res.json(updated);
        }
        catch (e) {
            next(e);
        }
    }
    async deleteSource(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            await sourceService_js_1.sourceService.deleteSource(id);
            res.status(204).send();
        }
        catch (e) {
            next(e);
        }
    }
    async triggerIngestion(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const result = await sourceService_js_1.sourceService.triggerIngestion(id);
            res.json(result);
        }
        catch (e) {
            next(e);
        }
    }
}
exports.SourceController = SourceController;
exports.sourceController = new SourceController();
