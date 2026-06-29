import { prisma } from './prisma';
import { cacheService } from './cache';
import { carlcareService } from './carlcare';
import { validateImei } from '../utils/imei';
import { generateServiceNumber } from '../utils/helpers';
import { ValidationError, NotFoundError, AppError } from '../utils/errors';
import { config } from '../config';

export class LookupService {
  async searchByImei(imei: string, userId?: number, ip?: string) {
    const cleanImei = imei.replace(/\D/g, '');
    if (!validateImei(cleanImei)) {
      throw new ValidationError('Invalid IMEI format. Must be 15 digits.');
    }

    const cacheKey = `imei:${cleanImei}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const existing = await prisma.serviceRequest.findFirst({
      where: { imei: cleanImei },
      orderBy: { createdAt: 'desc' },
    });

    if (existing) {
      const result = this.formatResult(existing);
      await cacheService.set(cacheKey, result);
      await this.logLookup(cleanImei, 'local', true, ip, userId);
      return result;
    }

    const start = Date.now();
    try {
      const carlcareData = await carlcareService.lookupImei(cleanImei);
      const duration = Date.now() - start;

      if (carlcareData.code === 200 && carlcareData.data) {
        const d = carlcareData.data;
        const saved = await prisma.serviceRequest.create({
          data: {
            serviceNumber: d.service_number || generateServiceNumber(),
            imei: cleanImei,
            brand: d.brand || null,
            model: d.model || null,
            country: d.country || null,
            status: this.mapStatus(d.status || 'PENDING'),
            applicationTime: d.application_time ? new Date(d.application_time) : null,
            reviewTime: d.review_time ? new Date(d.review_time) : null,
            note: d.note || null,
            source: 'CARLCARE',
          },
        });

        await this.upsertDevice(cleanImei, d.brand, d.model, d.country);
        const result = this.formatResult(saved);
        await cacheService.set(cacheKey, result);
        await this.logLookup(cleanImei, 'carlcare', true, ip, userId, duration, JSON.stringify(carlcareData));
        return result;
      }

      await this.logLookup(cleanImei, 'carlcare', false, ip, userId, duration, JSON.stringify(carlcareData));
      return await this.handleNoRecord(cleanImei, ip, userId);
    } catch (error) {
      const duration = Date.now() - start;
      await this.logLookup(cleanImei, 'carlcare', false, ip, userId, duration, JSON.stringify({ error: (error as Error).message }));
      throw error;
    }
  }

  private async handleNoRecord(imei: string, ip?: string, userId?: number) {
    const country = await this.detectCountry(imei);
    if (country === 'Thailand') {
      const existingPending = await prisma.serviceRequest.findFirst({
        where: { imei, status: { in: ['PENDING', 'PROCESSING'] } },
      });

      if (existingPending) {
        return {
          found: false,
          autoSubmitted: false,
          message: 'A pending request already exists for this IMEI',
          existingServiceNumber: existingPending.serviceNumber,
        };
      }

      const serviceNumber = generateServiceNumber();
      const request = await prisma.serviceRequest.create({
        data: {
          serviceNumber,
          imei,
          country: 'Thailand',
          status: 'PENDING',
          submittedBy: userId || null,
          source: 'MANUAL',
        },
      });

      return {
        found: false,
        autoSubmitted: true,
        serviceNumber: request.serviceNumber,
        status: request.status,
        message: 'Auto-submitted for Thailand region',
      };
    }

    return { found: false, message: 'No Record Found' };
  }

  private async detectCountry(imei: string): Promise<string> {
    const device = await prisma.device.findUnique({ where: { imei } });
    return device?.country || 'Unknown';
  }

  private async upsertDevice(imei: string, brand?: string, model?: string, country?: string) {
    await prisma.device.upsert({
      where: { imei },
      update: { brand, model, country },
      create: { imei, brand, model, country },
    });
  }

  private mapStatus(status: string): string {
    const upper = status.toUpperCase();
    if (upper === 'APPROVED') return 'APPROVED';
    if (upper === 'DISAPPROVED') return 'DISAPPROVED';
    if (upper === 'PROCESSING') return 'PROCESSING';
    if (upper === 'CANCELLED') return 'CANCELLED';
    return 'PENDING';
  }

  private formatResult(record: any) {
    return {
      imei: record.imei,
      brand: record.brand,
      model: record.model,
      country: record.country,
      serviceNumber: record.serviceNumber,
      status: record.status,
      applicationTime: record.applicationTime,
      reviewTime: record.reviewTime,
      note: record.note,
      source: record.source,
    };
  }

  private async logLookup(
    imei: string, source: string, found: boolean,
    ip?: string, userId?: number, duration?: number, responseRaw?: string
  ) {
    try {
      await prisma.lookupLog.create({
        data: { imei, source, found, ip, userId, duration, responseRaw },
      });
    } catch {
    }
  }
}

export const lookupService = new LookupService();
