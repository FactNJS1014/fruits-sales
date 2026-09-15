import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2, "ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร"),
  lastName: z.string().min(2, "นามสกุลต้องมีความยาวอย่างน้อย 2 ตัวอักษร"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  phone: z.string().min(9, "เบอร์โทรศัพท์ไม่ถูกต้อง"),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});

export const loginSchema = z.object({
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

// ในไฟล์ src/lib/validation.ts
export const fruitSchema = z.object({
  name: z.string().min(2, "กรุณาระบุชื่อผลไม้"),
  slug: z.string().min(2, "กรุณาระบุ slug"),
  category: z.string().min(1, "กรุณาระบุหมวดหมู่"),
  description: z.string().min(5, "กรุณากรอกคำอธิบาย"),
  price: z.number().positive("ราคาต้องมากกว่า 0"),
  unit: z.string().min(1, "กรุณาระบุหน่วย"),
  stock: z.number().int().min(0, "จำนวนสต็อกต้องไม่ติดลบ"),
  minOrder: z.number().int().min(1, "จำนวนสั่งซื้อขั้นต่ำต้องอย่างน้อย 1"),
  maxOrder: z.number().int().min(1, "จำนวนสั่งซื้อสูงสุดต้องมากกว่า 0"),
  harvestSeason: z.string().min(1, "กรุณาระบุช่วงฤดูกาล เก็บเกี่ยว"),
  origin: z.string().min(1, "กรุณาระบุแหล่งที่มา"),
  imageUrl: z.string().min(1, "กรุณาอัปโหลดรูปภาพ"), // เปลี่ยนจาก z.string().url() เป็น min(1)
  status: z.enum(["AVAILABLE", "LOW_STOCK", "SOLD_OUT", "INACTIVE"]),
  featured: z.boolean().default(false),
});

export const bookingSchema = z.object({
  fruitId: z.string().uuid("ID ผลไม้ไม่ถูกต้อง"),
  quantity: z.number().int().min(1, "จำนวนต้องอย่างน้อย 1"),
  customerNote: z.string().optional(),
});
