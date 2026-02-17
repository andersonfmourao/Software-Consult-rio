import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function upsertUser(email: string, role: Role, password: string) {
  const passwordHash = await bcrypt.hash(password, 12);

  return prisma.user.upsert({
    where: { email },
    create: { email, role, passwordHash },
    update: { role, passwordHash }
  });
}

async function main() {
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const recepcaoPassword = process.env.SEED_RECEPCAO_PASSWORD;

  if (!adminPassword || !recepcaoPassword) {
    throw new Error("Defina SEED_ADMIN_PASSWORD e SEED_RECEPCAO_PASSWORD para executar o seed.");
  }

  await upsertUser("admin@clinica.local", Role.ADMIN, adminPassword);
  await upsertUser("recepcao@clinica.local", Role.RECEPCAO, recepcaoPassword);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
