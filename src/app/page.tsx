import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { ShieldCheck, Truck, Sparkles, ArrowRight } from "lucide-react";

export default async function HomePage() {
  const featuredFruits = await prisma.fruit.findMany({
    where: { featured: true, status: { not: "INACTIVE" } },
    take: 4,
  });

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-950 rounded-3xl overflow-hidden text-white shadow-xl">
        <div className="max-w-3xl px-8 py-16 md:py-24 relative z-10 space-y-6">
          <span className="inline-flex items-center space-x-2 bg-emerald-500/30 border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide text-emerald-200">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Fresh Fruits Directly From Our Garden</span>
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            สดจากสวน คัดคุณภาพ <br />
            <span className="text-emerald-400">ส่งตรงถึงมือคุณ</span>
          </h1>
          <p className="text-emerald-100 text-lg leading-relaxed">
            สัมผัสรสชาติผลไม้สดใหม่ที่เก็บจากต้นวันต่อวัน ปลูกด้วยความใส่ใจ
            ปลอดสารพิษ สั่งจองล่วงหน้ารับประกันคุณภาพสดใหม่ทุกคำ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/fruits"
              className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg transition"
            >
              เลือกดูผลไม้ทั้งหมด <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/my-bookings"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/20 transition backdrop-blur-xs"
            >
              ตรวจสอบรายการจอง
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-emerald-100 shadow-xs space-y-3">
          <div className="bg-emerald-50 p-3.5 rounded-xl w-fit text-emerald-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">สดจากสวน 100%</h3>
          <p className="text-slate-600 text-sm">
            เก็บสดใหม่ตามออเดอร์จากต้น ไม่ผ่านการค้างสต็อกนาน
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-emerald-100 shadow-xs space-y-3">
          <div className="bg-emerald-50 p-3.5 rounded-xl w-fit text-emerald-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">การันตีคุณภาพ</h3>
          <p className="text-slate-600 text-sm">
            คัดสรรทุกผลด้วยมาตรฐานระดับพรีเมียม หวาน อร่อย ตามธรรมชาติ
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-emerald-100 shadow-xs space-y-3">
          <div className="bg-emerald-50 p-3.5 rounded-xl w-fit text-emerald-600">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">
            สั่งจองง่าย รวดเร็ว
          </h3>
          <p className="text-slate-600 text-sm">
            ระบบสั่งจองออนไลน์ล่วงหน้า พร้อมแจ้งเตือนสถานะผ่าน Email Realtime
          </p>
        </div>
      </section>

      {/* Featured Fruits */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              ผลไม้แนะนำประจำฤดูกาล
            </h2>
            <p className="text-slate-600 text-sm">
              ผลไม้ยอดนิยมสดใหม่ที่พร้อมให้คุณสั่งจองในตอนนี้
            </p>
          </div>
          <Link
            href="/fruits"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            ดูทั้งหมด &rarr;
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredFruits.map((fruit) => (
            <div
              key={fruit.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col"
            >
              <div className="relative h-48 w-full bg-slate-100">
                <Image
                  src={fruit.imageUrl}
                  alt={fruit.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    {fruit.category}
                  </span>
                  <h3 className="font-bold text-slate-900 mt-2 line-clamp-1">
                    {fruit.name}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1">
                    แหล่งที่มา: {fruit.origin}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div>
                    <span className="text-lg font-extrabold text-emerald-600">
                      {formatPrice(Number(fruit.price))}
                    </span>
                    <span className="text-xs text-slate-500">
                      {" "}
                      / {fruit.unit}
                    </span>
                  </div>
                  <Link
                    href={`/fruits/${fruit.id}`}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition"
                  >
                    สั่งจองเลย
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
