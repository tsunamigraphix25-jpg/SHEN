"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  picture: string | null;
  academicBackground: string | null;
  shenRole: string | null;
  bio: string | null;
  createdAt: string;
  articleCount: number;
}

export default function AdminMembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/auth/check");
    if (!res.ok) router.push("/admin");
  }, [router]);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  useEffect(() => {
    fetch("/api/members")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setMembers(data); })
      .finally(() => setLoading(false));
  }, []);

  const roleColors: Record<string, string> = {
    admin: "bg-red-100 text-red-800",
    editor: "bg-blue-100 text-blue-800",
    member: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="min-h-screen bg-shen-gray-50">
      <header className="bg-white border-b border-shen-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="text-shen-gray-500 hover:text-shen-purple">← Dashboard</Link>
            <span className="text-shen-gray-300">/</span>
            <span className="font-semibold text-shen-gray-900">Members</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12 text-shen-gray-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div key={member.id} className="bg-white rounded-xl border border-shen-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-shen-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-shen-purple font-bold">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-shen-gray-900">{member.name}</h3>
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${roleColors[member.role] || ""}`}>
                      {member.role}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-shen-gray-600">
                  <p>📧 {member.email}</p>
                  {member.shenRole && <p>🏷️ {member.shenRole}</p>}
                  {member.academicBackground && <p>🎓 {member.academicBackground}</p>}
                  <p>📄 {member.articleCount} publication{member.articleCount !== 1 ? "s" : ""}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
