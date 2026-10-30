import axios from 'axios';
import { config } from '../config.js';

export class AIClientService {
  private client = axios.create({
    baseURL: config.aiServiceUrl,
    timeout: 30000,
    headers: {
      'x-internal-secret': config.internalSecret,
    },
  });

  async checkHealth() {
    try {
      const res = await this.client.get('/health');
      return res.data;
    } catch (e: any) {
      return { status: 'offline', error: e.message };
    }
  }

  async checkAdaptersStatus() {
    try {
      const res = await this.client.get('/health/adapters');
      return res.data;
    } catch (e: any) {
      return { status: 'offline', error: e.message };
    }
  }

  async triggerSourceIngestion(platform: string, identifier: string, limit: number = 20) {
    const res = await this.client.post('/api/ingest/trigger', {
      platform,
      identifier,
      limit,
    });
    return res.data;
  }

  async normalizeDate(text: string) {
    const res = await this.client.post('/api/ai/normalize-date', { text });
    return res.data;
  }

  async extractFromPost(rawPost: any, ocrText?: string) {
    const res = await this.client.post('/api/ai/extract', rawPost, {
      params: { ocrText },
    });
    return res.data;
  }

  async checkDeduplication(candidate: any, existingEvents: any[]) {
    const res = await this.client.post('/api/ai/deduplicate', {
      candidate,
      existingEvents,
    });
    return res.data;
  }
}

export const aiClient = new AIClientService();
