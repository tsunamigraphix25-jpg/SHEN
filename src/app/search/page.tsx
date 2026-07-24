"use client";

import PublicLayout from "@/components/PublicLayout";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  authorName: string | null;
  publishedAt: string | null;
  readingTime: number | null;
}

const categoryLabels: Record<string, string> = {
  article: "Article", research: "Research", news: "News", event: "Event",
  gallery: "Gallery", safety_report: "Safety Report", training_material: "Training Material",
};

const categoryColors: Record<string, string> = {
  article: "bg-blue-100 text-blue-800", research: "bg-purple-100 text-purple-800",
  news: "bg-green-100 text-green-800", event: "bg-orange-100 text-orange-800",
  gallery: "bg-pink-100 text-pink-800", safety_report: "bg-red-100 text-red-800",
  training_material: "bg-yellow-100 text-yellow-800",
};

function SearchInner() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<Article[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/articles?search=${encodeURIComponent(query)}&status=published`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setResults([]);
    }
    setSearched(true);
    setLoading(false);
  };

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-shen-gray-900 mb-6">Search</h1>
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, research, news..."
            className="flex-1 px-4 py-3 border border-shen-gray-200 rounded-lg focus:ring-2 focus:ring-shen-purple focus:border-transparent outline-none"
          />
          <button type="submit" disabled={loading} className="px-6 py-3 bg-shen-purple text-white font-medium rounded-lg hover:bg-shen-purple-dark transition-colors disabled:opacity-50">
            {loading ? "..." : "Search"}
          </button>
        </form>

        {searched && (
          <div>
            <p className="text-sm text-shen-gray-500 mb-4">{results.length} result{results.length !== 1 ? "s" : ""} found</p>
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((article) => (
                  <Link key={article.id} href={`/content/${article.slug}`} className="block bg-white p-5 rounded-xl border border-shen-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${categoryColors[article.category] || ""}`}>
                        {categoryLabels[article.category] || article.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-shen-gray-900 mb-1">{article.title}</h3>
                    {article.excerpt && <p className="text-sm text-shen-gray-600 line-clamp-2">{article.excerpt}</p>}
                    <div className="text-xs text-shen-gray-400 mt-2">{article.authorName}</div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-shen-gray-500">No results found for &ldquo;{query}&rdquo;</div>
            )}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-shen-gray-500">Loading...</div>}>
      <SearchInner />
    </Suspense>
  );
}
