import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { fruitSchema } from "@/lib/validation";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "newest";

    const where: any = {
      status: { not: "INACTIVE" },
      AND: [],
    };

    if (search) {
      where.AND.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    if (category) {
      where.AND.push({ category });
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    if (sort === "price_desc") orderBy = { price: "desc" };
    if (sort === "name") orderBy = { name: "asc" };

    const fruits = await prisma.fruit.findMany({
      where,
      orderBy,
    });

    return NextResponse.json({ fruits });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Error fetching fruits";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 430 });
    }

    const body = await req.json();
    const validated = fruitSchema.parse(body);

    const existingSlug = await prisma.fruit.findUnique({
      where: { slug: validated.slug },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: "Slug นี้ถูกใช้งานแล้ว" },
        { status: 400 },
      );
    }

    const fruit = await prisma.fruit.create({
      data: validated,
    });

    return NextResponse.json({ success: true, fruit }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating fruit";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
