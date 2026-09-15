import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import StatusBadge from "@/components/bookings/StatusBadge";
import { notFound } from "next/navigation";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAuth();
  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!booking || (booking.userId !== user.id && user.role !== "ADMIN")) {
    notFound();
  }

  const steps = ["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED"];
  const isCancelled = booking.status === "CANCELLED";
  const currentStepIndex = steps.indexOf(booking.status);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-6 gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-400">
              หมายเลขคำสั่งจอง
            </span>
            <h1 className="text-2xl font-black text-blue-600 font-mono">
              {booking.bookingNumber}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              วันที่จอง: {new Date(booking.createdAt).toLocaleString("th-TH")}
            </p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        {/* Timeline Status Tracker */}
        {!isCancelled ? (
          <div className="py-6">
            <div className="flex justify-between items-center relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -z-0 -translate-y-1/2" />
              {steps.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                return (
                  <div
                    key={step}
                    className="flex flex-col items-center relative z-10"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isPassed ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"}`}
                    >
                      {idx + 1}
                    </div>
                    <span className="text-[10px] font-semibold mt-2 text-slate-600">
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-center font-bold text-sm">
            รายการนี้ถูกยกเลิกแล้ว (Cancelled)
          </div>
        )}

        {/* Item Summary Table */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">
            รายการผลไม้ที่สั่งจอง
          </h3>
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="p-4">รายการ</th>
                  <th className="p-4">ราคา/หน่วย</th>
                  <th className="p-4">จำนวน</th>
                  <th className="p-4 text-right">รวม</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {booking.items.map((item) => (
                  <tr key={item.id}>
                    <td className="p-4 font-semibold text-slate-900">
                      {item.fruitName}
                    </td>
                    <td className="p-4 text-slate-600">
                      {formatPrice(Number(item.price))}
                    </td>
                    <td className="p-4 text-slate-600">{item.quantity}</td>
                    <td className="p-4 font-bold text-right text-slate-900">
                      {formatPrice(Number(item.subtotal))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-700 block mb-1">
              หมายเหตุจากลูกค้า:
            </span>
            <p className="text-slate-600">{booking.customerNote || "-"}</p>
          </div>
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <span className="font-bold text-blue-900 block mb-1">
              หมายเหตุจากเจ้าของสวน:
            </span>
            <p className="text-blue-800">{booking.adminNote || "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
