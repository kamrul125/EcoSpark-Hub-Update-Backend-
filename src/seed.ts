import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123456', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN', // আপনার এনামে যা আছে (ADMIN/Admin) সেটি দিন
    },
  });

  // Seed fixed categories with deterministic UUIDs so frontend fallbacks
  // can safely rely on these IDs.
  const categories = [
    { id: '6b1f9c0a-4c2b-4f3d-9b2a-1a2b3c4d5e6f', name: 'Energy' },
    { id: 'a3f9d2b0-6c7e-4a1b-8d3c-2b4a5f6e7d8c', name: 'Waste Management' },
    { id: 'd2c3b4a5-6e7f-4c8b-9a1b-3c4d5e6f7a8b', name: 'Transportation' },
    { id: 'f1e2d3c4-b5a6-4f7e-8d9c-0a1b2c3d4e5f', name: 'Sustainability' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      // Match on unique `name` to avoid conflicts with existing categories
      where: { name: cat.name },
      // If a category exists with the same name, update its id to the
      // deterministic UUID so frontend and DB stay in sync.
      update: { id: cat.id },
      create: { id: cat.id, name: cat.name },
    });
  }

  console.log({ admin, seededCategories: categories.map(c => c.name) });

  console.log({ admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });