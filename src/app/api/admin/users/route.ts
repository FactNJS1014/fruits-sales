import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 403 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const { userId, role, status } = await req.json();

    if (status === "INACTIVE") {
      const activeAdminCount = await prisma.user.count({
        where: { role: "ADMIN", status: "ACTIVE" },
      });
      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (targetUser?.role === "ADMIN" && activeAdminCount <= 1) {
        return NextResponse.json(
          { error: "ต้องมีบัญชี ADMIN ที่ใช้งานได้อย่างน้อย 1 บัญชีในระบบ" },
          { status: 400 },
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role, status },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating user";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
