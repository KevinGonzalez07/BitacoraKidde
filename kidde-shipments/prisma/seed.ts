// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 12);
  const guardPassword = await bcrypt.hash('guardia123', 12);

  await prisma.user.upsert({
    where: { email: 'admin@kidde.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@kidde.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'guardia@kidde.com' },
    update: {},
    create: {
      name: 'Guardia Principal',
      email: 'guardia@kidde.com',
      password: guardPassword,
      role: Role.GUARD,
    },
  });

  console.log('✅ Seed completado');
  console.log('👤 Admin: admin@kidde.com / admin123');
  console.log('👷 Guardia: guardia@kidde.com / guardia123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
