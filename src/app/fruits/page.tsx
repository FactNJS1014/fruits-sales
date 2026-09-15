import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default async function FruitsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; sort?: string }>;
}) {
  const { search = "", category = "", sort = "newest" } = await searchParams;

  const where: any = {
    status: { not: "INACTIVE" },
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category) {
    where.category = category;
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };
  if (sort === "name") orderBy = { name: "asc" };

  const fruits = await prisma.fruit.findMany({ where, orderBy });
  const categories = await prisma.fruit.groupBy({
    by: ["category"],
    where: { status: { not: "INACTIVE" } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          ผลไม้สดจากสวนทั้งหมด
        </h1>
        <p className="text-slate-500 text-sm">
          คัดสรรคุณภาพ สดใหม่ พร้อมส่งตรงจากสวน
        </p>
      </div>

      {/* Filter & Search Bar */}
      <form
        method="GET"
        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4"
      >
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="ค้นหาชื่อผลไม้ หรือรายละเอียด..."
          className="flex-1 px-4 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
        />

        <select
          name="category"
          defaultValue={category}
          className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
        >
          <option value="">ทุกหมวดหมู่</option>
          {categories.map((c) => (
            <option key={c.category} value={c.category}>
              {c.category}
            </option>
          ))}
        </select>

        <select
          name="sort"
          defaultValue={sort}
          className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
        >
          <option value="newest">มาใหม่ล่าสุด</option>
          <option value="price_asc">ราคา: น้อยไปมาก</option>
          <option value="price_desc">ราคา: มากไปน้อย</option>
          <option value="name">ชื่อผลไม้ A-Z</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl text-sm transition"
        >
          ค้นหา
        </button>
      </form>

      {/* Fruit Grid */}
      {fruits.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
          ไม่พบรายการผลไม้ตามเงื่อนไขที่ค้นหา
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {fruits.map((fruit) => (
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
                />
                {fruit.stock <= 0 && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white font-bold text-sm">
                    สินค้าหมด (Sold Out)
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                    {fruit.category}
                  </span>
                  <h3 className="font-bold text-slate-900 mt-2 line-clamp-1">
                    {fruit.name}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1">
                    คงเหลือ: {fruit.stock} {fruit.unit}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div>
                    <span className="text-lg font-extrabold text-blue-600">
                      {formatPrice(Number(fruit.price))}
                    </span>
                    <span className="text-xs text-slate-500">
                      {" "}
                      / {fruit.unit}
                    </span>
                  </div>
                  <Link
                    href={`/fruits/${fruit.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition"
                  >
                    สั่งจอง
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
