"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, PlusCircle, AlertCircle, Upload, X } from "lucide-react";

export default function AddFruitPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "Tropical Fruit",
    description: "",
    price: 80,
    unit: "kg",
    stock: 100,
    minOrder: 1,
    maxOrder: 20,
    harvestSeason: "March - June",
    origin: "Our Garden",
    imageUrl: "",
    status: "AVAILABLE",
    featured: false,
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setFormData((prev) => ({
      ...prev,
      name,
      slug: generatedSlug || prev.slug,
    }));
  };

  // 📷 ฟังก์ชันจัดการเมื่อเลือกไฟล์รูปภาพ
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ตรวจสอบขนาดไฟล์ (จำกัดไม่เกิน 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("ขนาดไฟล์รูปภาพต้องไม่เกิน 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setFormData((prev) => ({ ...prev, imageUrl: base64String }));
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.imageUrl) {
      setError("กรุณาอัปโหลดรูปภาพผลไม้");
      setLoading(false);
      return;
    }

    if (formData.maxOrder < formData.minOrder) {
      setError("จำนวนสั่งซื้อสูงสุดต้องมากกว่าหรือเท่ากับจำนวนขั้นต่ำ");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/fruits", {
        method: "POST",
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            เพิ่มรายการผลไม้ใหม่
          </h1>
          <p className="text-slate-500 text-sm">
            กรอกข้อมูลผลไม้สดจากสวนเพื่อเปิดให้ลูกค้าสั่งจอง
          </p>
        </div>
        <Link
          href="/admin/fruits"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-xl transition shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ย้อนกลับ</span>
        </Link>
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
          {/* Fruit Name */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              ชื่อผลไม้ *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={handleNameChange}
              placeholder="เช่น มะม่วงน้ำดอกไม้พรีเมียม"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          {/* Slug */}
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
              placeholder="golden-mango"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
            />
          </div>

          {/* Category */}
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
              <option value="Tropical Fruit">
                Tropical Fruit (ผลไม้เมืองร้อน)
              </option>
              <option value="Premium Fruit">
                Premium Fruit (เกรดพรีเมียม)
              </option>
              <option value="Seasonal Fruit">Seasonal Fruit (ตามฤดูกาล)</option>
              <option value="Organic Fruit">Organic Fruit (อินทรีย์)</option>
            </select>
          </div>

          {/* Price & Unit */}
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
                placeholder="kg, comb, box"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          </div>

          {/* Stock */}
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

          {/* Min & Max Order */}
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

          {/* Harvest Season */}
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
              placeholder="March - June หรือ ทั้งปี"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          {/* Origin */}
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
              placeholder="Rayong Organic Farm"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>
        </div>

        {/* 📷 File Upload Area */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            รูปภาพผลไม้ *
          </label>

          {imagePreview ? (
            <div className="relative w-full h-64 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 group">
              <Image
                src={imagePreview}
                alt="Fruit Preview"
                fill
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
                <Upload className="w-8 h-8 mb-2 text-blue-600" />
                <p className="mb-1 text-sm font-semibold text-slate-700">
                  คลิกเพื่อเลือกไฟล์รูปภาพ (Choose Files)
                </p>
                <p className="text-xs text-slate-400">
                  รองรับไฟล์ PNG, JPG, WEBP (ไม่เกิน 5MB)
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Description */}
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
            placeholder="อธิบายรสชาติ สายพันธุ์ เกรดผลไม้..."
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
          />
        </div>

        {/* Status & Featured */}
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

        {/* Form Actions */}
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
            <PlusCircle className="w-4 h-4" />
            <span>
              {loading ? "กำลังบันทึกข้อมูล..." : "บันทึกข้อมูลผลไม้"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
