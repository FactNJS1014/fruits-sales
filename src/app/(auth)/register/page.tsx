"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, AlertCircle } from "lucide-react";

// ⚠️ ต้องมีคำว่า "export default" ที่หน้าฟังก์ชัน Component
export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "เกิดข้อผิดพลาดในการลงทะเบียน");

      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-2xl mb-2">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          สร้างบัญชีผู้ใช้ใหม่
        </h1>
        <p className="text-sm text-slate-500">
          สมัครสมาชิกเพื่อเริ่มสั่งจองผลไม้สดจากสวน
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              ชื่อ
            </label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              placeholder="สมชาย"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              นามสกุล
            </label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              placeholder="ใจดี"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            อีเมล
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
            placeholder="example@email.com"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            เบอร์โทรศัพท์
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
            placeholder="0812345678"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            รหัสผ่าน
          </label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
            placeholder="อย่างน้อย 6 ตัวอักษร"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            ยืนยันรหัสผ่าน
          </label>
          <input
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
            placeholder="กรอกรหัสผ่านซ้ำอีกครั้ง"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-xl transition shadow-xs text-sm"
        >
          {loading ? "กำลังลงทะเบียน..." : "ลงทะเบียนบัญชี"}
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
        มีบัญชีผู้ใช้งานอยู่แล้ว?{" "}
        <Link
          href="/login"
          className="text-blue-600 font-semibold hover:underline"
        >
          เข้าสู่ระบบ
        </Link>
      </div>
    </div>
  );
}
