import { prisma } from "@/lib/db";
import UserRoleChanger from "./UserRoleChanger";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          จัดการข้อมูลผู้ใช้งาน
        </h1>
        <p className="text-slate-500 text-sm">
          ตรวจสอบและบริหารจัดการสิทธิ์ผู้ใช้ในระบบ
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <th className="p-4">ชื่อ-นามสกุล</th>
              <th className="p-4">อีเมล</th>
              <th className="p-4">เบอร์โทรศัพท์</th>
              <th className="p-4">สิทธิ์ (Role)</th>
              <th className="p-4">สถานะ</th>
              <th className="p-4 text-right">ปรับเปลี่ยนสิทธิ์</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-900">
                  {u.firstName} {u.lastName}
                </td>
                <td className="p-4 text-slate-600">{u.email}</td>
                <td className="p-4 text-slate-600">{u.phone}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 rounded-md text-xs font-bold ${u.role === "ADMIN" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"}`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <UserRoleChanger
                    userId={u.id}
                    currentRole={u.role}
                    currentStatus={u.status}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
