import { Queue, QueueEvents } from 'bullmq';
import { config } from '../config';

let imeiLookupQueue: Queue | null = null;
let imeiLookupQueueEvents: QueueEvents | null = null;

try {
  const connection = { url: config.redis.url };
  imeiLookupQueue = new Queue('imei-lookup', { connection });
  imeiLookupQueueEvents = new QueueEvents('imei-lookup', { connection });
} catch {
  console.warn('Redis unavailable - queue processing disabled');
}

export { imeiLookupQueue, imeiLookupQueueEvents };

export async function addImeiLookupJob(imei: string, userId?: number): Promise<string | null> {
  if (!imeiLookupQueue) {
    console.warn('Queue unavailable - skipping job');
    return null;
  }
  const job = await imeiLookupQueue.add('lookup-imei', { imei, userId }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: 100,
    removeOnFail: 50,
  });
  return job.id!;
}
