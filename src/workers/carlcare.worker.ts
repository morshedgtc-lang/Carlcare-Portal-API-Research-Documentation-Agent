import { Worker } from 'bullmq';
import { config } from '../config';
import { carlcareService } from '../services/carlcare';
import { prisma } from '../services/prisma';
import { generateServiceNumber } from '../utils/helpers';

const connection = { url: config.redis.url };

const worker = new Worker(
  'imei-lookup',
  async (job) => {
    const { imei, userId } = job.data;
    console.log(`[Worker] Processing IMEI: ${imei}`);

    const existing = await prisma.serviceRequest.findFirst({
      where: { imei },
      orderBy: { createdAt: 'desc' },
    });
    if (existing) {
      return { cached: true, serviceNumber: existing.serviceNumber };
    }

    const response = await carlcareService.lookupImei(imei);
    if (response.code === 200 && response.data) {
      const d = response.data;
      const saved = await prisma.serviceRequest.create({
        data: {
          serviceNumber: d.service_number || generateServiceNumber(),
          imei,
          brand: d.brand,
          model: d.model,
          country: d.country,
          status: mapStatus(d.status),
          applicationTime: d.application_time ? new Date(d.application_time) : null,
          reviewTime: d.review_time ? new Date(d.review_time) : null,
          note: d.note,
          source: 'CARLCARE',
          submittedBy: userId,
        },
      });
      return { found: true, data: saved };
    }

    await prisma.serviceRequest.create({
      data: {
        serviceNumber: generateServiceNumber(),
        imei,
        status: 'PENDING',
        source: 'CARLCARE',
        submittedBy: userId,
      },
    });
    return { found: false };
  },
  {
    connection,
    concurrency: 5,
    limiter: { max: 10, duration: 1000 },
  }
);

function mapStatus(status?: string) {
  const upper = (status || '').toUpperCase();
  if (upper === 'APPROVED') return 'APPROVED';
  if (upper === 'DISAPPROVED') return 'DISAPPROVED';
  if (upper === 'PROCESSING') return 'PROCESSING';
  return 'PENDING';
}

worker.on('completed', (job) => {
  console.log(`[Worker] Job ${job.id} completed for IMEI: ${job.data.imei}`);
});

worker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed:`, err.message);
});

console.log('[Worker] Carlcare lookup worker started');
