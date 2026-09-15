import { BookingStatus } from "@prisma/client";

const statusConfig: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "รอดำเนินการ",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  CONFIRMED: {
    label: "ยืนยันแล้ว",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  PREPARING: {
    label: "กำลังเตรียมผลไม้",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  READY: {
    label: "พร้อมจัดส่ง/รับสินค้า",
    className: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  COMPLETED: {
    label: "สำเร็จแล้ว",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  CANCELLED: {
    label: "ยกเลิกแล้ว",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

export default function StatusBadge({ status }: { status: BookingStatus }) {
  const config = statusConfig[status] || {
    label: status,
    className: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
