import { prisma, SourcePlatform, SourceStatus } from '@abrospot/database';
import { aiClient } from './aiClientService.js';

export interface CreateSourceDto {
  platform: SourcePlatform;
  identifier: string;
  displayName: string;
  description?: string;
  sourceUrl?: string;
  fetchFrequencyMinutes?: number;
}

export class SourceService {
  async getSources() {
    return prisma.monitoredSource.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { posts: true, ingestionJobs: true },
        },
      },
    });
  }

  async createSource(dto: CreateSourceDto) {
    return prisma.monitoredSource.create({
      data: {
        platform: dto.platform,
        identifier: dto.identifier.trim(),
        displayName: dto.displayName,
        description: dto.description,
        sourceUrl: dto.sourceUrl,
        fetchFrequencyMinutes: dto.fetchFrequencyMinutes || 30,
        status: SourceStatus.ACTIVE,
      },
    });
  }

  async updateSource(id: string, data: Partial<CreateSourceDto> & { status?: SourceStatus }) {
    return prisma.monitoredSource.update({
      where: { id },
      data,
    });
  }

  async deleteSource(id: string) {
    return prisma.monitoredSource.delete({
      where: { id },
    });
  }

  async triggerIngestion(id: string) {
    const source = await prisma.monitoredSource.findUnique({ where: { id } });
    if (!source) throw new Error('Monitored source not found');

    const result = await aiClient.triggerSourceIngestion(
      source.platform,
      source.identifier,
      20
    );

    await prisma.monitoredSource.update({
      where: { id },
      data: {
        lastFetchedAt: new Date(),
      },
    });

    return result;
  }
}

export const sourceService = new SourceService();
