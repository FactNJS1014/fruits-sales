"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, AlertCircle } from "lucide-react";

export default function EditFruitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "Tropical Fruit",
    description: "",
    price: 0,
    unit: "kg",
    stock: 0,
    minOrder: 1,
    maxOrder: 20,
    harvestSeason: "",
    origin: "",
    imageUrl: "",
    status: "AVAILABLE",
    featured: false,
  });

  useEffect(() => {
    fetch(`/api/fruits/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.fruit) {
          setFormData({
            ...data.fruit,
            price: Number(data.fruit.price),
          });
        } else {
          setError("ไม่พบข้อมูลผลไม้นี้");
        }
      })
      .catch(() => setError("เกิดข้อผิดพลาดในการโหลดข้อมูล"))
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/fruits/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");

      router.push("/admin/fruits");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการผลไม้นี้?")) return;

    try {
      const res = await fetch(`/api/fruits/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("ไม่สามารถลบรายการได้");

      router.push("/admin/fruits");
      router.refresh();
    } catch {
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  if (fetching) {
    return (
      <div className="p-8 text-center text-slate-500">
        กำลังโหลดข้อมูลผลไม้...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            แก้ไขข้อมูลผลไม้
          </h1>
          <p className="text-slate-500 text-sm">
            อัปเดตรายละเอียด ราคา หรือจำนวนสต็อก
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDelete}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>ลบรายการ</span>
          </button>
          <Link
            href="/admin/fruits"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-xl transition shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ย้อนกลับ</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              ชื่อผลไม้ *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Slug (URL) *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              หมวดหมู่ *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
            >
              <option value="Tropical Fruit">Tropical Fruit</option>
              <option value="Premium Fruit">Premium Fruit</option>
              <option value="Seasonal Fruit">Seasonal Fruit</option>
              <option value="Organic Fruit">Organic Fruit</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                ราคา (บาท) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                หน่วย *
              </label>
              <input
                type="text"
                required
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              จำนวนสต็อก *
            </label>
            <input
              type="number"
              min="0"
              required
              value={formData.stock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                สั่งขั้นต่ำ *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.minOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minOrder: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                สั่งสูงสุด *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.maxOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxOrder: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              ช่วงฤดูกาลเก็บเกี่ยว *
            </label>
            <input
              type="text"
              required
              value={formData.harvestSeason}
              onChange={(e) =>
                setFormData({ ...formData, harvestSeason: e.target.value })
              }
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              แหล่งที่มา/สวน *
            </label>
            <input
              type="text"
              required
              value={formData.origin}
              onChange={(e) =>
                setFormData({ ...formData, origin: e.target.value })
              }
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Image URL *
          </label>
          <input
            type="url"
            required
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            คำอธิบายรายละเอียดผลไม้ *
          </label>
          <textarea
            rows={3}
            required
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              สถานะสินค้า
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as any })
              }
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
            >
              <option value="AVAILABLE">AVAILABLE (พร้อมขาย)</option>
              <option value="LOW_STOCK">LOW_STOCK (สต็อกต่ำ)</option>
              <option value="SOLD_OUT">SOLD_OUT (สินค้าหมด)</option>
              <option value="INACTIVE">INACTIVE (ซ่อนรายการ)</option>
            </select>
          </div>

          <div className="flex items-center space-x-3 pt-6">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 border-slate-300 rounded-md focus:ring-blue-500"
            />
            <label
              htmlFor="featured"
              className="text-sm font-semibold text-slate-800 cursor-pointer"
            >
              ตั้งเป็นผลไม้แนะนำหน้าแรก (Featured Fruit)
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
          <Link
            href="/admin/fruits"
            className="px-5 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 transition"
          >
            ยกเลิก
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition shadow-xs flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>
              {loading ? "กำลังอัปเดตข้อมูล..." : "บันทึกการเปลี่ยนแปลง"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
