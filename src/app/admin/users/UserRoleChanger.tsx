"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Role, UserStatus } from "@prisma/client";

export default function UserRoleChanger({
  userId,
  currentRole,
  currentStatus,
}: {
  userId: string;
  currentRole: Role;
  currentStatus: UserStatus;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (role: Role, status: UserStatus) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role, status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "เกิดข้อผิดพลาด");

      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-end items-center space-x-2">
      <select
        value={currentRole}
        onChange={(e) => handleUpdate(e.target.value as Role, currentStatus)}
        disabled={loading}
        className="px-2 py-1 border border-slate-300 rounded-md text-xs bg-white"
      >
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
      </select>

      <button
        onClick={() =>
          handleUpdate(
            currentRole,
            currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE",
          )
        }
        disabled={loading}
        className={`px-2 py-1 rounded-md text-xs font-semibold border ${currentStatus === "ACTIVE" ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"}`}
      >
        {currentStatus === "ACTIVE" ? "ระงับ" : "ปลดระงับ"}
      </button>
    </div>
  );
}
