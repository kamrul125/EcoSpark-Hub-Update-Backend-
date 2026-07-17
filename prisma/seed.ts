declare const process: {
  exit(code?: number): never;
};

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('AdminPassword123', 12);
  const userPassword = await bcrypt.hash('UserPassword123', 12);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {
      name: 'User',
      password: userPassword,
      role: 'MEMBER',
    },
    create: {
      name: 'User',
      email: 'user@example.com',
      password: userPassword,
      role: 'MEMBER',
    },
  });

  console.log('🌱 Seeding completed successfully!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
