import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { User, Mail, Phone, Shield } from "lucide-react";

export default async function ProfilePage() {
  const session = await requireAuth();
  const user = await prisma.user.findUnique({ where: { id: session.id } });

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">โปรไฟล์ผู้ใช้งาน</h1>
        <p className="text-slate-500 text-sm">
          จัดการข้อมูลส่วนตัวและรายละเอียดบัญชีของคุณ
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center space-x-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-2xl">
            {user.firstName[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {user.firstName} {user.lastName}
            </h2>
            <span className="inline-block mt-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-blue-200">
              {user.role} Account
            </span>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex items-center space-x-3 text-slate-700">
            <User className="w-5 h-5 text-slate-400" />
            <span>
              ชื่อเต็ม:{" "}
              <strong>
                {user.firstName} {user.lastName}
              </strong>
            </span>
          </div>
          <div className="flex items-center space-x-3 text-slate-700">
            <Mail className="w-5 h-5 text-slate-400" />
            <span>
              อีเมล: <strong>{user.email}</strong>
            </span>
          </div>
          <div className="flex items-center space-x-3 text-slate-700">
            <Phone className="w-5 h-5 text-slate-400" />
            <span>
              เบอร์โทรศัพท์: <strong>{user.phone}</strong>
            </span>
          </div>
          <div className="flex items-center space-x-3 text-slate-700">
            <Shield className="w-5 h-5 text-slate-400" />
            <span>
              สถานะบัญชี:{" "}
              <strong className="text-emerald-600">{user.status}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
