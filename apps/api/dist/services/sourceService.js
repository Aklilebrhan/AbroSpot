"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sourceService = exports.SourceService = void 0;
const database_1 = require("@abrospot/database");
const aiClientService_js_1 = require("./aiClientService.js");
class SourceService {
    async getSources() {
        return database_1.prisma.monitoredSource.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { posts: true, ingestionJobs: true },
                },
            },
        });
    }
    async createSource(dto) {
        return database_1.prisma.monitoredSource.create({
            data: {
                platform: dto.platform,
                identifier: dto.identifier.trim(),
                displayName: dto.displayName,
                description: dto.description,
                sourceUrl: dto.sourceUrl,
                fetchFrequencyMinutes: dto.fetchFrequencyMinutes || 30,
                status: database_1.SourceStatus.ACTIVE,
            },
        });
    }
    async updateSource(id, data) {
        return database_1.prisma.monitoredSource.update({
            where: { id },
            data,
        });
    }
    async deleteSource(id) {
        return database_1.prisma.monitoredSource.delete({
            where: { id },
        });
    }
    async triggerIngestion(id) {
        const source = await database_1.prisma.monitoredSource.findUnique({ where: { id } });
        if (!source)
            throw new Error('Monitored source not found');
        const result = await aiClientService_js_1.aiClient.triggerSourceIngestion(source.platform, source.identifier, 20);
        await database_1.prisma.monitoredSource.update({
            where: { id },
            data: {
                lastFetchedAt: new Date(),
            },
        });
        return result;
    }
}
exports.SourceService = SourceService;
exports.sourceService = new SourceService();
