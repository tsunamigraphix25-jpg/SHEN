"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  status: string;
  authorName: string | null;
  viewCount: number | null;
  publishedAt: string | null;
  createdAt: string;
}

const categoryLabels: Record<string, string> = {
  article: "Article", research: "Research", news: "News", event: "Event",
  gallery: "Gallery", safety_report: "Safety Report", training_material: "Training Material",
};

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700", pending: "bg-yellow-100 text-yellow-800",
  under_editing: "bg-blue-100 text-blue-800", approved: "bg-lime-100 text-lime-800",
  published: "bg-emerald-100 text-emerald-800",
};

const statusLabels: Record<string, string> = {
  draft: "Draft", pending: "Pending", under_editing: "Editing", approved: "Approved", published: "Published",
};

export default function AdminArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/auth/check");
    if (!res.ok) router.push("/admin");
  }, [router]);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  useEffect(() => {
    fetch("/api/articles")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setArticles(data); })
      .finally(() => setLoading(false));
  }, []);

  const deleteArticle = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
    if (res.ok) setArticles(articles.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-shen-gray-50">
      <header className="bg-white border-b border-shen-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="text-shen-gray-500 hover:text-shen-primary">← Dashboard</Link>
            <span className="text-shen-gray-300">/</span>
            <span className="font-semibold text-shen-gray-900">All Publications</span>
          </div>
          <Link
            href="/admin/articles/new"
            className="px-4 py-2 bg-gradient-to-r from-shen-primary to-shen-accent text-white text-sm font-medium rounded-lg hover:from-shen-primary-dark hover:to-shen-accent-dark transition-all"
          >
            + New Article
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12 text-shen-gray-500">Loading...</div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-shen-gray-100">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="font-semibold text-shen-gray-900 mb-2">No articles yet</h3>
            <p className="text-shen-gray-500 mb-4">Start creating content for your Knowledge Hub</p>
            <Link href="/admin/articles/new" className="inline-block px-6 py-2 bg-shen-primary text-white rounded-lg">Create your first article</Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-shen-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-shen-gray-50 text-left text-xs font-semibold text-shen-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Author</th>
                    <th className="px-6 py-3">Views</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-shen-gray-100">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-shen-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-shen-gray-900 text-sm max-w-xs truncate">{article.title}</div>
                        <div className="text-xs text-shen-gray-400 mt-0.5">{article.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-shen-gray-600">{categoryLabels[article.category] || article.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[article.status] || ""}`}>
                          {statusLabels[article.status] || article.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-shen-gray-600">{article.authorName || "—"}</td>
                      <td className="px-6 py-4 text-sm text-shen-gray-600">{article.viewCount || 0}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/articles/${article.id}/edit`} className="text-xs text-shen-primary hover:underline">Edit</Link>
                          <Link href={`/content/${article.slug}`} className="text-xs text-shen-gray-500 hover:underline">View</Link>
                          <button onClick={() => deleteArticle(article.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
