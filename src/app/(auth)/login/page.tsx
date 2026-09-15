"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromPath = searchParams.get("from") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");

      // นำผู้ใช้กลับไปหน้าที่พยายามกดสั่งจองก่อนหน้า (หรือหน้า /admin ถ้าเป็น admin)
      router.push(data.user.role === "ADMIN" ? "/admin" : fromPath);
      router.refresh();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-2xl mb-2">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">เข้าสู่ระบบ</h1>
        <p className="text-sm text-slate-500">
          กรอกข้อมูลบัญชีเพื่อเข้าใช้งาน Fruit Garden
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            อีเมล
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
            placeholder="admin@fruitgarden.com"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            รหัสผ่าน
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-xl transition shadow-xs text-sm"
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
        ยังไม่มีบัญชีผู้ใช้?{" "}
        <Link
          href="/register"
          className="text-blue-600 font-semibold hover:underline"
        >
          ลงทะเบียนใหม่
        </Link>
      </div>
    </div>
  );
}
