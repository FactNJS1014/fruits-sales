import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validation";
import { signJWT } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!user || user.status === "INACTIVE") {
      return NextResponse.json(
        { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือบัญชีถูกระงับ" },
        { status: 401 },
      );
    }

    const isValid = await bcrypt.compare(validated.password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 },
      );
    }

    const token = await signJWT({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
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
      err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
