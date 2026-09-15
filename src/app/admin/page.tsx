import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import StatusBadge from "@/components/bookings/StatusBadge";
import {
  ShoppingBasket,
  Users,
  ClipboardList,
  AlertTriangle,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const [totalFruits, totalUsers, totalBookings, pendingCount, lowStockFruits] =
    await Promise.all([
      prisma.fruit.count(),
      prisma.user.count(),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.fruit.findMany({ where: { stock: { lte: 10 } } }),
    ]);

  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: true, items: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard ภาพรวมระบบ
        </h1>
        <p className="text-slate-500 text-sm">
          สรุปข้อมูลสถิติและการดำเนินงานของสวน
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">ผลไม้ในระบบ</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {totalFruits}
            </p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <ShoppingBasket className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">
              ผู้ใช้งานทั้งหมด
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {totalUsers}
            </p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">
              การสั่งจองทั้งหมด
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {totalBookings}
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <ClipboardList className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">รอดำเนินการ</p>
            <p className="text-2xl font-black text-amber-600 mt-1">
              {pendingCount}
            </p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Low Stock Warning */}
      {lowStockFruits.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-amber-800 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>แจ้งเตือนสินค้าสต็อกต่ำ (Low Stock Warnings)</span>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {lowStockFruits.map((f) => (
              <div
                key={f.id}
                className="bg-white p-3 rounded-xl border border-amber-200 flex justify-between items-center text-xs"
              >
                <span className="font-semibold text-slate-800">{f.name}</span>
                <span className="bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded-md">
                  คงเหลือ {f.stock} {f.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Bookings Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs space-y-4 p-5">
        <h3 className="font-bold text-slate-900">รายการสั่งจองล่าสุด</h3>
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <th className="p-3 font-semibold">Booking No.</th>
              <th className="p-3 font-semibold">ลูกค้า</th>
              <th className="p-3 font-semibold">ยอดรวม</th>
              <th className="p-3 font-semibold">สถานะ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recentBookings.map((b) => (
              <tr key={b.id}>
                <td className="p-3 font-mono font-bold text-blue-600">
                  {b.bookingNumber}
                </td>
                <td className="p-3 text-slate-800">
                  {b.user.firstName} {b.user.lastName}
                </td>
                <td className="p-3 font-bold text-slate-900">
                  {formatPrice(Number(b.total))}
                </td>
                <td className="p-3">
                  <StatusBadge status={b.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
