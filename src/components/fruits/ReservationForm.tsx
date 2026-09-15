"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { AlertCircle, ShoppingCart } from "lucide-react";

interface FruitProps {
  id: string;
  price: number;
  stock: number;
  unit: string;
  minOrder: number;
  maxOrder: number;
}

export default function ReservationForm({ fruit }: { fruit: FruitProps }) {
  const router = useRouter();
  const pathname = usePathname();
  const [quantity, setQuantity] = useState<number>(fruit.minOrder);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = fruit.price * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. ตรวจสอบสถานะการเข้าสู่ระบบเบื้องต้นก่อน
      const checkAuth = await fetch("/api/auth/me", { cache: "no-store" });
      if (!checkAuth.ok) {
        // หากยังไม่ได้เข้าสู่ระบบ ให้พาไปหน้า /login พร้อมแนบ URL เดิมไปกับ parameter 'from'
        router.push(`/login?from=${encodeURIComponent(pathname)}`);
        return;
      }

      // 2. ถ้าเข้าสู่ระบบแล้ว ให้ส่งคำขอสั่งจองตามปกติ
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fruitId: fruit.id,
          quantity,
          customerNote: note,
        }),
      });

      const data = await res.json();

      // หาก API แจ้งเตือนว่าไม่ได้เข้าสู่ระบบ (401 Unauthorized)
      if (res.status === 401) {
        router.push(`/login?from=${encodeURIComponent(pathname)}`);
        return;
      }

      if (!res.ok)
        throw new Error(data.error || "เกิดข้อผิดพลาดในการส่งคำขอสั่งจอง");

      // จองสำเร็จ เปลี่ยนหน้าไปที่รายละเอียดการจอง
      router.push(`/my-bookings/${data.booking.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fruit.stock <= 0) {
    return (
      <div className="p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-center font-semibold">
        สินค้าหมดชั่วคราว (Sold Out)
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100"
    >
      {error && (
        <div className="p-3 bg-rose-50 text-rose-600 border border-rose-200 text-xs rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700">
          ระบุจำนวน ({fruit.unit}):
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min={fruit.minOrder}
            max={Math.min(fruit.stock, fruit.maxOrder)}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-20 px-3 py-1.5 border border-slate-300 rounded-lg text-center font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700 block mb-1">
          หมายเหตุถึงสวน (ถ้ามี):
        </label>
        <textarea
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="เช่น ขอผลสุกพร้อมทาน..."
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-emerald-100">
        <span className="text-sm font-medium text-slate-600">
          ราคารวมสุทธิ:
        </span>
        <span className="text-2xl font-black text-emerald-600">
          {formatPrice(subtotal)}
        </span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-semibold py-3 rounded-xl transition shadow-md flex items-center justify-center space-x-2 cursor-pointer"
      >
        <ShoppingCart className="w-5 h-5" />
        <span>{loading ? "กำลังตรวจสอบ..." : "ยืนยันการสั่งจอง"}</span>
      </button>
    </form>
  );
}
