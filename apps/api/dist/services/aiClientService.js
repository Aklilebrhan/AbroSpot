"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiClient = exports.AIClientService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_js_1 = require("../config.js");
class AIClientService {
    client = axios_1.default.create({
        baseURL: config_js_1.config.aiServiceUrl,
        timeout: 30000,
        headers: {
            'x-internal-secret': config_js_1.config.internalSecret,
        },
    });
    async checkHealth() {
        try {
            const res = await this.client.get('/health');
            return res.data;
        }
        catch (e) {
            return { status: 'offline', error: e.message };
        }
    }
    async checkAdaptersStatus() {
        try {
            const res = await this.client.get('/health/adapters');
            return res.data;
        }
        catch (e) {
            return { status: 'offline', error: e.message };
        }
    }
    async triggerSourceIngestion(platform, identifier, limit = 20) {
        const res = await this.client.post('/api/ingest/trigger', {
            platform,
            identifier,
            limit,
        });
        return res.data;
    }
    async normalizeDate(text) {
        const res = await this.client.post('/api/ai/normalize-date', { text });
        return res.data;
    }
    async extractFromPost(rawPost, ocrText) {
        const res = await this.client.post('/api/ai/extract', rawPost, {
            params: { ocrText },
        });
        return res.data;
    }
    async checkDeduplication(candidate, existingEvents) {
        const res = await this.client.post('/api/ai/deduplicate', {
            candidate,
            existingEvents,
        });
        return res.data;
    }
}
exports.AIClientService = AIClientService;
exports.aiClient = new AIClientService();
