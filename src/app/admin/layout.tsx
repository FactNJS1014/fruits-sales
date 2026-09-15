import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBasket,
  ClipboardList,
  Users,
  ArrowLeft,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border border-slate-200 rounded-2xl p-4 h-fit space-y-2 shadow-xs">
        <div className="px-3 py-2 border-b border-slate-100 mb-2">
          <h2 className="font-bold text-slate-900 text-base">ระบบจัดการสวน</h2>
          <p className="text-xs text-slate-400">Admin Control Panel</p>
        </div>
        <nav className="space-y-1">
          <Link
            href="/admin"
            className="flex items-center space-x-3 px-3 py-2.5 text-sm font-semibold rounded-xl text-slate-700 hover:bg-slate-100"
          >
            <LayoutDashboard className="w-4 h-4 text-blue-600" />
            <span>ภาพรวม Dashboard</span>
          </Link>
          <Link
            href="/admin/fruits"
            className="flex items-center space-x-3 px-3 py-2.5 text-sm font-semibold rounded-xl text-slate-700 hover:bg-slate-100"
          >
            <ShoppingBasket className="w-4 h-4 text-blue-600" />
            <span>จัดการผลไม้</span>
          </Link>
          <Link
            href="/admin/bookings"
            className="flex items-center space-x-3 px-3 py-2.5 text-sm font-semibold rounded-xl text-slate-700 hover:bg-slate-100"
          >
            <ClipboardList className="w-4 h-4 text-blue-600" />
            <span>จัดการการสั่งจอง</span>
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center space-x-3 px-3 py-2.5 text-sm font-semibold rounded-xl text-slate-700 hover:bg-slate-100"
          >
            <Users className="w-4 h-4 text-blue-600" />
            <span>จัดการผู้ใช้งาน</span>
          </Link>
        </nav>
        <div className="pt-4 border-t border-slate-100">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับสู่หน้าร้าน</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <section className="flex-1 space-y-6">{children}</section>
    </div>
  );
}
