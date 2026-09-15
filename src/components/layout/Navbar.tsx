"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { ShoppingBag, LogOut, Menu, X, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    firstName: string;
    role: string;
  } | null>(null);

  // 1. ประกาศ Hooks ทั้งหมดก่อน
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [pathname, checkAuth]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setCurrentUser(null);
      document.cookie =
        "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      window.location.href = "/login";
    }
  };

  // 2. 🟢 ย้ายเงื่อนไขเช็คเพื่อซ่อน Navbar มาไว้ตรงนี้ (หลังรัน Hooks ครบแล้ว)
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  // 3. Render JSX ของ Navbar ปกติ
  return (
    <nav className="bg-white border-b border-emerald-100 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link
            href="/"
            className="flex items-center space-x-2 font-bold text-xl text-emerald-600"
          >
            <ShoppingBag className="h-6 w-6 text-emerald-600" />
            <span>Fruit Garden</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`text-sm font-medium ${pathname === "/" ? "text-emerald-600 font-bold" : "text-slate-600 hover:text-emerald-600"}`}
            >
              หน้าแรก
            </Link>
            <Link
              href="/fruits"
              className={`text-sm font-medium ${pathname.startsWith("/fruits") ? "text-emerald-600 font-bold" : "text-slate-600 hover:text-emerald-600"}`}
            >
              ผลไม้ทั้งหมด
            </Link>

            {currentUser ? (
              <>
                <Link
                  href="/my-bookings"
                  className={`text-sm font-medium ${pathname.startsWith("/my-bookings") ? "text-emerald-600 font-bold" : "text-slate-600 hover:text-emerald-600"}`}
                >
                  รายการสั่งจองของฉัน
                </Link>

                {currentUser.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-md flex items-center space-x-1 border border-amber-200"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>ผู้ดูแลระบบ</span>
                  </Link>
                )}

                <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
                  <span className="text-sm text-slate-700 font-medium">
                    สวัสดี, {currentUser.firstName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-500 hover:text-rose-600 transition cursor-pointer"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-700 hover:text-emerald-600 px-3 py-2"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-xl shadow-xs transition"
                >
                  ลงทะเบียน
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-emerald-600 p-2"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-emerald-100 px-4 pt-2 pb-4 space-y-2">
          <Link
            href="/"
            className="block py-2 text-slate-700 font-medium"
            onClick={() => setIsOpen(false)}
          >
            หน้าแรก
          </Link>
          <Link
            href="/fruits"
            className="block py-2 text-slate-700 font-medium"
            onClick={() => setIsOpen(false)}
          >
            ผลไม้ทั้งหมด
          </Link>
          {currentUser ? (
            <>
              <Link
                href="/my-bookings"
                className="block py-2 text-slate-700 font-medium"
                onClick={() => setIsOpen(false)}
              >
                รายการสั่งจองของฉัน
              </Link>
              {currentUser.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="block py-2 text-amber-700 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  แผงควบคุมระบบ (Admin)
                </Link>
              )}
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full text-left py-2 text-rose-600 font-medium"
              >
                ออกจากระบบ
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
              <Link
                href="/login"
                className="block w-full text-center py-2 text-slate-700 border border-slate-200 rounded-xl"
                onClick={() => setIsOpen(false)}
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/register"
                className="block w-full text-center py-2 bg-emerald-600 text-white rounded-xl"
                onClick={() => setIsOpen(false)}
              >
                ลงทะเบียน
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
