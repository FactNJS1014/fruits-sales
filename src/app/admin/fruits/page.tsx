import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Plus, Edit3 } from "lucide-react";

export default async function AdminFruitsPage() {
  const fruits = await prisma.fruit.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            จัดการข้อมูลผลไม้
          </h1>
          <p className="text-slate-500 text-sm">
            เพิ่ม แก้ไข หรือปรับเปลี่ยนสถานะผลไม้ในสวน
          </p>
        </div>
        <Link
          href="/admin/fruits/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-sm flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มผลไม้ใหม่</span>
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <th className="p-4">รูปภาพ</th>
              <th className="p-4">ชื่อผลไม้</th>
              <th className="p-4">หมวดหมู่</th>
              <th className="p-4">ราคา</th>
              <th className="p-4">สต็อก</th>
              <th className="p-4">สถานะ</th>
              <th className="p-4 text-right">การกระทำ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {fruits.map((f) => (
              <tr key={f.id} className="hover:bg-slate-50/50">
                <td className="p-4">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100">
                    <Image
                      src={f.imageUrl}
                      alt={f.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="p-4 font-bold text-slate-900">{f.name}</td>
                <td className="p-4 text-slate-600">{f.category}</td>
                <td className="p-4 font-semibold text-slate-900">
                  {formatPrice(Number(f.price))} / {f.unit}
                </td>
                <td className="p-4 font-semibold">{f.stock}</td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold border ${f.status === "AVAILABLE" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : f.status === "LOW_STOCK" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}
                  >
                    {f.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link
                    href={`/admin/fruits/${f.id}/edit`}
                    className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-semibold border border-blue-200"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>แก้ไข</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
