"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Submission {
  id: number;
  fullName: string;
  shenPosition: string | null;
  email: string;
  category: string;
  title: string;
  description: string | null;
  content: string | null;
  references: string | null;
  status: string;
  reviewNotes: string | null;
  createdAt: string;
}

const categoryLabels: Record<string, string> = {
  article: "Article", research: "Research", news: "News", event: "Event",
  gallery: "Gallery", safety_report: "Safety Report", training_material: "Training Material",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  under_editing: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  published: "bg-emerald-100 text-emerald-800",
};

const statusLabels: Record<string, string> = {
  pending: "Pending Review", under_editing: "Under Editing", approved: "Approved", published: "Published",
};

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/auth/check");
    if (!res.ok) router.push("/admin");
  }, [router]);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  useEffect(() => {
    fetch("/api/submissions")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setSubmissions(data); })
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/submissions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setSubmissions(submissions.map(s => s.id === id ? { ...s, status: updated.status } : s));
    }
  };

  const deleteSubmission = async (id: number) => {
    if (!confirm("Delete this submission?")) return;
    const res = await fetch(`/api/submissions/${id}`, { method: "DELETE" });
    if (res.ok) setSubmissions(submissions.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-shen-gray-50">
      <header className="bg-white border-b border-shen-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="text-shen-gray-500 hover:text-shen-purple">← Dashboard</Link>
            <span className="text-shen-gray-300">/</span>
            <span className="font-semibold text-shen-gray-900">Submissions</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12 text-shen-gray-500">Loading...</div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-shen-gray-100">
            <div className="text-4xl mb-3">📬</div>
            <h3 className="font-semibold text-shen-gray-900 mb-2">No submissions yet</h3>
            <p className="text-shen-gray-500">Member submissions will appear here for review.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => (
              <div key={sub.id} className="bg-white rounded-xl border border-shen-gray-100 overflow-hidden">
                <div className="p-5 flex items-start justify-between gap-4 cursor-pointer" onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[sub.status] || "bg-gray-100 text-gray-700"}`}>
                        {statusLabels[sub.status] || sub.status}
                      </span>
                      <span className="text-xs text-shen-gray-400">{categoryLabels[sub.category] || sub.category}</span>
                    </div>
                    <h3 className="font-semibold text-shen-gray-900">{sub.title}</h3>
                    <div className="text-sm text-shen-gray-500 mt-1">
                      {sub.fullName} {sub.shenPosition && `· ${sub.shenPosition}`} · {sub.email}
                    </div>
                    <div className="text-xs text-shen-gray-400 mt-1">
                      Submitted: {new Date(sub.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="text-shen-gray-400 text-xl">{expandedId === sub.id ? "▲" : "▼"}</span>
                </div>

                {expandedId === sub.id && (
                  <div className="border-t border-shen-gray-100 p-5 bg-shen-gray-50">
                    {sub.description && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-shen-gray-900 mb-1">Description</h4>
                        <p className="text-sm text-shen-gray-600">{sub.description}</p>
                      </div>
                    )}
                    {sub.content && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-shen-gray-900 mb-1">Content</h4>
                        <div className="text-sm text-shen-gray-600 bg-white p-3 rounded-lg border border-shen-gray-200 max-h-48 overflow-y-auto whitespace-pre-wrap font-mono text-xs">
                          {sub.content}
                        </div>
                      </div>
                    )}
                    {sub.references && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-shen-gray-900 mb-1">References</h4>
                        <p className="text-sm text-shen-gray-600">{sub.references}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-shen-gray-200">
                      <span className="text-xs text-shen-gray-500 mr-2 self-center">Update status:</span>
                      {["pending", "under_editing", "approved", "published"].map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(sub.id, s)}
                          className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${sub.status === s ? "ring-2 ring-shen-purple ring-offset-1" : ""} ${statusColors[s]}`}
                        >
                          {statusLabels[s]}
                        </button>
                      ))}
                      <button
                        onClick={() => deleteSubmission(sub.id)}
                        className="px-3 py-1 text-xs rounded-full font-medium bg-red-100 text-red-700 ml-auto"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
