import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { bookingSchema } from "@/lib/validation";
import { generateBookingNumber } from "@/lib/utils";
import { sendBookingCreatedEmail } from "@/lib/mail";
import { NotificationType } from "@prisma/client";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const validated = bookingSchema.parse(body);

    // Run Atomic Transaction to prevent race conditions on stock
    const result = await prisma.$transaction(async (tx) => {
      const fruit = await tx.fruit.findUnique({
        where: { id: validated.fruitId },
      });

      if (!fruit || fruit.status === "INACTIVE") {
        throw new Error("ไม่พบข้อมูลผลไม้รายการนี้");
      }

      if (fruit.stock < validated.quantity) {
        throw new Error(
          `สินค้าในสต็อกไม่เพียงพอ (คงเหลือ ${fruit.stock} ${fruit.unit})`,
        );
      }

      if (
        validated.quantity < fruit.minOrder ||
        validated.quantity > fruit.maxOrder
      ) {
        throw new Error(
          `จำนวนสั่งซื้อต้องอยู่ระหว่าง ${fruit.minOrder} ถึง ${fruit.maxOrder} ${fruit.unit}`,
        );
      }

      const itemPrice = Number(fruit.price);
      const subtotal = itemPrice * validated.quantity;
      const bookingNumber = generateBookingNumber();

      const booking = await tx.booking.create({
        data: {
          bookingNumber,
          userId: user.id,
          total: subtotal,
          status: "PENDING",
          customerNote: validated.customerNote,
          items: {
            create: [
              {
                fruitId: fruit.id,
                fruitName: fruit.name,
                price: itemPrice,
                quantity: validated.quantity,
                subtotal,
              },
            ],
          },
          statusHistory: {
            create: [
              {
                oldStatus: "PENDING",
                newStatus: "PENDING",
                changedBy: user.email,
                note: "สร้างคำสั่งจองสำเร็จ",
              },
            ],
          },
        },
      });

      const updatedStock = fruit.stock - validated.quantity;
      const newStatus =
        updatedStock === 0
          ? "SOLD_OUT"
          : updatedStock <= 10
            ? "LOW_STOCK"
            : "AVAILABLE";

      await tx.fruit.update({
        where: { id: fruit.id },
        data: {
          stock: updatedStock,
          status: newStatus,
        },
      });

      await tx.notification.create({
        data: {
          userId: user.id,
          bookingId: booking.id,
          type: NotificationType.BOOKING_CREATED,
          title: "สร้างรายการสั่งจองสำเร็จ",
          message: `รายการสั่งจอง #${booking.bookingNumber} ถูกสร้างเรียบร้อยแล้ว`,
        },
      });

      return booking;
    });

    await sendBookingCreatedEmail(
      user.email,
      result.bookingNumber,
      Number(result.total),
    );

    return NextResponse.json(
      { success: true, booking: result },
      { status: 201 },
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "ไม่สามารถสร้างการสั่งจองได้";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
