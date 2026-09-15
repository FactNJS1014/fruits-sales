import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { fruitSchema } from "@/lib/validation";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const fruit = await prisma.fruit.findUnique({ where: { id } });

    if (!fruit) {
      return NextResponse.json({ error: "Fruit not found" }, { status: 404 });
    }

    return NextResponse.json({ fruit });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching fruit";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const validated = fruitSchema.parse(body);

    const updatedFruit = await prisma.fruit.update({
      where: { id },
      data: validated,
    });

    return NextResponse.json({ success: true, fruit: updatedFruit });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating fruit";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.fruit.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting fruit";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
