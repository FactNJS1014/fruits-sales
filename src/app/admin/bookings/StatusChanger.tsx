"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookingStatus } from "@prisma/client";

export default function StatusChanger({
  bookingId,
  currentStatus,
}: {
  bookingId: string;
  currentStatus: BookingStatus;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (!newStatus || newStatus === currentStatus) return;

    if (
      !confirm(
        `ยืนยันการเปลี่ยนสถานะเป็น ${newStatus} หรือไม่? ระบบจะทำการส่ง Email แจ้งเตือนไปยังลูกค้าอัตโนมัติ`,
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("เกิดข้อผิดพลาดในการอัปเดต");

      router.refresh();
    } catch {
      alert("ไม่สามารถอัปเดตสถานะได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={loading}
      className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
    >
      <option value="PENDING">PENDING</option>
      <option value="CONFIRMED">CONFIRMED</option>
      <option value="PREPARING">PREPARING</option>
      <option value="READY">READY</option>
      <option value="COMPLETED">COMPLETED</option>
      <option value="CANCELLED">CANCELLED</option>
    </select>
  );
}
