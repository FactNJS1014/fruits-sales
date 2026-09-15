import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import StatusBadge from "@/components/bookings/StatusBadge";
import Link from "next/link";

export default async function MyBookingsPage() {
  const user = await requireAuth();

  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          รายการสั่งจองของฉัน
        </h1>
        <p className="text-slate-500 text-sm">
          ติดตามสถานะคำสั่งจองผลไม้สดจากสวน
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
          <p className="text-slate-500">
            คุณยังไม่มีรายการสั่งจองผลไม้ในขณะนี้
          </p>
          <Link
            href="/fruits"
            className="inline-block bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg text-sm"
          >
            ไปเลือกชมผลไม้
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <th className="p-4 font-semibold">หมายเลขการจอง</th>
                  <th className="p-4 font-semibold">วันที่จอง</th>
                  <th className="p-4 font-semibold">รายการผลไม้</th>
                  <th className="p-4 font-semibold">ยอดรวม</th>
                  <th className="p-4 font-semibold">สถานะ</th>
                  <th className="p-4 font-semibold text-right">การกระทำ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-mono font-bold text-blue-600">
                      {booking.bookingNumber}
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(booking.createdAt).toLocaleDateString("th-TH")}
                    </td>
                    <td className="p-4 font-medium text-slate-900">
                      {booking.items
                        .map((item) => `${item.fruitName} (${item.quantity})`)
                        .join(", ")}
                    </td>
                    <td className="p-4 font-bold text-slate-900">
                      {formatPrice(Number(booking.total))}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/my-bookings/${booking.id}`}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200"
                      >
                        ดูรายละเอียด
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
