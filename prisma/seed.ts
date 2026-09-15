import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed clean up and initialization...");

  // เคลียร์ข้อมูลเดิมใน Database
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "User", "Fruit", "Booking", "BookingItem", "BookingStatusHistory", "Notification", "AuditLog" CASCADE;`,
  );

  // สร้างเฉพาะบัญชี Admin สวนสำหรับเข้าเริ่มต้นระบบครั้งแรก
  const adminPassword = await bcrypt.hash("AdminPassword123!", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@fruitgarden.com",
      passwordHash: adminPassword,
      firstName: "Garden",
      lastName: "Administrator",
      phone: "0812345678",
      role: Role.ADMIN,
    },
  });

  console.log(`✅ Admin account created: ${admin.email}`);
  console.log("ℹ️  User registers will handle general user data.");
  console.log(
    "ℹ️  Fruit management is reserved exclusively for Admin creation via Dashboard.",
  );
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
