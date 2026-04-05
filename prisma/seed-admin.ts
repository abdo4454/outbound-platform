import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const email = "abdomohamedd950@gmail.com";
  const password = "Admin123!";
  const name = "Admin";

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await db.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, name, passwordHash },
  });

  // Create org if not already there
  let org = await db.organization.findFirst({ where: { slug: "accelrated-growth" } });
  if (!org) {
    org = await db.organization.create({
      data: {
        name: "Accelrated Growth",
        slug: "accelrated-growth",
        plan: "ENTERPRISE",
        status: "ACTIVE",
      },
    });
    await db.onboarding.create({ data: { orgId: org.id } });
  }

  // Add as ADMIN member
  await db.member.upsert({
    where: { userId_orgId: { userId: user.id, orgId: org.id } },
    update: { role: "ADMIN" },
    create: {
      userId: user.id,
      email: user.email,
      name: user.name,
      orgId: org.id,
      role: "ADMIN",
    },
  });

  console.log("✓ Admin user created");
  console.log("  Email:   ", email);
  console.log("  Password:", password);
  console.log("  Role:    ADMIN");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
