import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Sample device
  await prisma.device.upsert({
    where: { imei: '490154203237518' },
    update: {},
    create: { imei: '490154203237518', brand: 'Tecno', model: 'Camon 20', country: 'Thailand' },
  });

  // Sample service request
  await prisma.serviceRequest.upsert({
    where: { serviceNumber: 'SRV000001' },
    update: {},
    create: {
      serviceNumber: 'SRV000001',
      imei: '490154203237518',
      brand: 'Tecno',
      model: 'Camon 20',
      country: 'Thailand',
      status: 'APPROVED',
      applicationTime: new Date('2026-06-28'),
      reviewTime: new Date('2026-06-29'),
      note: 'Unlock request approved',
      source: 'CARLCARE',
    },
  });

  // Sample lookups
  await prisma.lookupLog.create({
    data: { imei: '490154203237518', source: 'local', found: true, duration: 12 },
  });

  console.log('Dev data seeded - try IMEI: 490154203237518');
}

main().catch(console.error).finally(() => prisma.$disconnect());
