"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const config_js_1 = require("../config.js");
class CacheService {
    client = null;
    memoryFallback = new Map();
    isConnected = false;
    constructor() {
        try {
            this.client = new ioredis_1.default(config_js_1.config.redisUrl, {
                lazyConnect: true,
                maxRetriesPerRequest: 1,
                retryStrategy: () => null, // Do not spam retries if offline
            });
            this.client.connect()
                .then(() => {
                this.isConnected = true;
                console.log('✅ Connected to Redis Cache');
            })
                .catch(() => {
                this.isConnected = false;
                console.log('ℹ️ Redis unavailable. Using in-memory cache fallback.');
            });
        }
        catch {
            this.isConnected = false;
        }
    }
    async get(key) {
        if (this.isConnected && this.client) {
            try {
                const val = await this.client.get(key);
                return val ? JSON.parse(val) : null;
            }
            catch {
                // Fallback
            }
        }
        const item = this.memoryFallback.get(key);
        if (!item)
            return null;
        if (Date.now() > item.expiry) {
            this.memoryFallback.delete(key);
            return null;
        }
        return JSON.parse(item.value);
    }
    async set(key, value, ttlSeconds = 300) {
        const serialized = JSON.stringify(value);
        if (this.isConnected && this.client) {
            try {
                await this.client.setex(key, ttlSeconds, serialized);
                return;
            }
            catch {
                // Fallback
            }
        }
        this.memoryFallback.set(key, {
            value: serialized,
            expiry: Date.now() + ttlSeconds * 1000,
        });
    }
    async del(keyPattern) {
        if (this.isConnected && this.client) {
            try {
                const keys = await this.client.keys(keyPattern);
                if (keys.length > 0) {
                    await this.client.del(...keys);
                }
            }
            catch {
                // Fallback
            }
        }
        // Clear matching memory keys
        for (const k of this.memoryFallback.keys()) {
            if (k.includes(keyPattern.replace('*', ''))) {
                this.memoryFallback.delete(k);
            }
        }
    }
}
exports.cache = new CacheService();
