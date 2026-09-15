import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { sendBookingStatusChangedEmail } from "@/lib/mail";
import { BookingStatus, NotificationType } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const { status, note } = await req.json();

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const oldStatus = booking.status;
    const newStatus = status as BookingStatus;

    const updatedBooking = await prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id },
        data: {
          status: newStatus,
          adminNote: note,
        },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId: id,
          oldStatus,
          newStatus,
          changedBy: admin.email,
          note,
        },
      });

      await tx.notification.create({
        data: {
          userId: booking.userId,
          bookingId: id,
          type: NotificationType.STATUS_CHANGED,
          title: "อัปเดตสถานะการสั่งจอง",
          message: `คำสั่งจอง #${booking.bookingNumber} เปลี่ยนสถานะเป็น ${newStatus}`,
        },
      });

      return updated;
    });

    await sendBookingStatusChangedEmail(
      booking.user.email,
      booking.bookingNumber,
      oldStatus,
      newStatus,
      note,
    );

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Error updating status";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
