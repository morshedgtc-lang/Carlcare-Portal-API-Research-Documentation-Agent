import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Easy2025', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'easyphone2024@gmail.com' },
    update: {},
    create: {
      email: 'easyphone2024@gmail.com',
      password,
      name: 'EasyPhone Admin',
      role: 'ADMIN',
    },
  });

  console.log('Seeded admin:');
  console.log(`  ${admin.email} / Easy2025 (ADMIN)`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
