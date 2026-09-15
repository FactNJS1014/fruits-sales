import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import StatusBadge from "@/components/bookings/StatusBadge";
import StatusChanger from "./StatusChanger";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: {
      user: true,
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          จัดการรายการสั่งจองทั้งหมด
        </h1>
        <p className="text-slate-500 text-sm">
          ตรวจสอบและปรับเปลี่ยนสถานะรายการสั่งจองจากลูกค้า
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <th className="p-4">Booking No.</th>
              <th className="p-4">ลูกค้า</th>
              <th className="p-4">ผลไม้</th>
              <th className="p-4">ยอดรวม</th>
              <th className="p-4">สถานะปัจจุบัน</th>
              <th className="p-4 text-right">เปลี่ยนสถานะ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-mono font-bold text-blue-600">
                  {b.bookingNumber}
                </td>
                <td className="p-4">
                  <div className="font-bold text-slate-900">
                    {b.user.firstName} {b.user.lastName}
                  </div>
                  <div className="text-xs text-slate-400">{b.user.email}</div>
                </td>
                <td className="p-4 text-slate-700">
                  {b.items
                    .map((i) => `${i.fruitName} (${i.quantity})`)
                    .join(", ")}
                </td>
                <td className="p-4 font-bold text-slate-900">
                  {formatPrice(Number(b.total))}
                </td>
                <td className="p-4">
                  <StatusBadge status={b.status} />
                </td>
                <td className="p-4 text-right">
                  <StatusChanger bookingId={b.id} currentStatus={b.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
