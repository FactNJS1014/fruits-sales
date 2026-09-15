import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validation";
import { signJWT } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "อีเมลนี้ถูกใช้งานแล้วในระบบ" },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(validated.password, 10);
    const user = await prisma.user.create({
      data: {
        firstName: validated.firstName,
        lastName: validated.lastName,
        email: validated.email,
        phone: validated.phone,
        passwordHash,
      },
    });

    const token = await signJWT({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, role: user.role },
    });
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 86400,
    });

    return response;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการลงทะเบียน";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
