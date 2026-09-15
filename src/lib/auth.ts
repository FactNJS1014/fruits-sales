import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { Role } from "@prisma/client";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ||
    "super-secret-jwt-key-change-this-in-production-min-32-chars",
);

export interface JWTPayload {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
}

export async function signJWT(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(JWT_SECRET);
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  return await verifyJWT(token);
}

export async function requireAuth(): Promise<JWTPayload> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function requireAdmin(): Promise<JWTPayload> {
  const user = await requireAuth();
  if (user.role !== Role.ADMIN) throw new Error("FORBIDDEN");
  return user;
}
