"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ArticleFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultCategory = searchParams.get("category") || "article";

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    coverImage: "",
    content: "",
    category: defaultCategory,
    status: "draft" as string,
    authorName: "",
    authorPosition: "",
    readingTime: 5,
    featured: false,
    references: "",
    researchArea: "",
    abstractText: "",
    pdfUrl: "",
    citation: "",
    eventDate: "",
    eventLocation: "",
    eventSpeakers: "",
    galleryMonth: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/auth/check");
    if (!res.ok) router.push("/admin");
  }, [router]);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create");
      }

      router.push("/admin/articles");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create");
      setSaving(false);
    }
  };

  const update = (field: string, value: string | number | boolean) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <div className="min-h-screen bg-shen-gray-50">
      <header className="bg-white border-b border-shen-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/admin/articles" className="text-shen-gray-500 hover:text-shen-primary">← Back</Link>
            <span className="text-shen-gray-300">/</span>
            <span className="font-semibold text-shen-gray-900">Create New Content</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-shen-gray-100 p-6 space-y-5">
            <h2 className="font-bold text-shen-gray-900">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">Category *</label>
                <select value={form.category} onChange={e => update("category", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg focus:ring-2 focus:ring-shen-primary focus:border-transparent outline-none bg-white">
                  <option value="article">Article</option>
                  <option value="research">Research Paper</option>
                  <option value="news">News</option>
                  <option value="event">Event Report</option>
                  <option value="gallery">Gallery / Highlights</option>
                  <option value="safety_report">Safety Report</option>
                  <option value="training_material">Training Material</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">Status</label>
                <select value={form.status} onChange={e => update("status", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg focus:ring-2 focus:ring-shen-primary focus:border-transparent outline-none bg-white">
                  <option value="draft">Draft</option>
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">Title *</label>
              <input type="text" required value={form.title} onChange={e => update("title", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg focus:ring-2 focus:ring-shen-primary focus:border-transparent outline-none" placeholder="Enter article title" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">Excerpt / Summary</label>
              <textarea rows={2} value={form.excerpt} onChange={e => update("excerpt", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg focus:ring-2 focus:ring-shen-primary focus:border-transparent outline-none resize-none" placeholder="Brief summary shown in listings" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">Header Image URL</label>
              <input type="url" value={form.coverImage} onChange={e => update("coverImage", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg focus:ring-2 focus:ring-shen-primary focus:border-transparent outline-none" placeholder="https://example.com/image.jpg" />
              <p className="text-xs text-shen-gray-400 mt-1">Paste a direct image URL to show it as the article header image.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">Author Name</label>
                <input type="text" value={form.authorName} onChange={e => update("authorName", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg focus:ring-2 focus:ring-shen-primary focus:border-transparent outline-none" placeholder="Author name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">Author Position</label>
                <input type="text" value={form.authorPosition} onChange={e => update("authorPosition", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg focus:ring-2 focus:ring-shen-primary focus:border-transparent outline-none" placeholder="e.g., Research Lead, SHEN" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">Reading Time (min)</label>
                <input type="number" min={1} value={form.readingTime} onChange={e => update("readingTime", parseInt(e.target.value) || 5)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg focus:ring-2 focus:ring-shen-primary focus:border-transparent outline-none" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured" checked={form.featured} onChange={e => update("featured", e.target.checked)} className="w-4 h-4 text-shen-primary rounded" />
              <label htmlFor="featured" className="text-sm font-medium text-shen-gray-700">Featured article (shown prominently on homepage)</label>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl border border-shen-gray-100 p-6 space-y-5">
            <h2 className="font-bold text-shen-gray-900">Content</h2>
            <div>
              <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">Article Content *</label>
              <textarea
                rows={15}
                required
                value={form.content}
                onChange={e => update("content", e.target.value)}
                className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg focus:ring-2 focus:ring-shen-primary focus:border-transparent outline-none resize-y font-mono text-sm"
                placeholder="Write your content here. Use ## for headings, **text** for bold, - for lists..."
              />
              <p className="text-xs text-shen-gray-400 mt-1">Supports basic markdown: ## Heading, **bold**, - list items</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">References</label>
              <textarea rows={3} value={form.references} onChange={e => update("references", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg focus:ring-2 focus:ring-shen-primary focus:border-transparent outline-none resize-none" placeholder="Citations and references" />
            </div>
          </div>

          {/* Research-specific */}
          {form.category === "research" && (
            <div className="bg-white rounded-xl border border-shen-gray-100 p-6 space-y-5">
              <h2 className="font-bold text-shen-gray-900">Research Details</h2>
              <div>
                <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">Abstract</label>
                <textarea rows={4} value={form.abstractText} onChange={e => update("abstractText", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg focus:ring-2 focus:ring-shen-primary focus:border-transparent outline-none resize-none" placeholder="Research abstract" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">Research Area</label>
                  <input type="text" value={form.researchArea} onChange={e => update("researchArea", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg focus:ring-2 focus:ring-shen-primary focus:border-transparent outline-none" placeholder="e.g., Environmental Health" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">PDF URL</label>
                  <input type="url" value={form.pdfUrl} onChange={e => update("pdfUrl", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg focus:ring-2 focus:ring-shen-primary focus:border-transparent outline-none" placeholder="https://..." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">Citation</label>
                <input type="text" value={form.citation} onChange={e => update("citation", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg focus:ring-2 focus:ring-shen-primary focus:border-transparent outline-none" placeholder="How to cite this paper" />
              </div>
            </div>
          )}

          {/* Event-specific */}
          {form.category === "event" && (
            <div className="bg-white rounded-xl border border-shen-gray-100 p-6 space-y-5">
              <h2 className="font-bold text-shen-gray-900">Event Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">Event Date</label>
                  <input type="text" value={form.eventDate} onChange={e => update("eventDate", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg focus:ring-2 focus:ring-shen-primary focus:border-transparent outline-none" placeholder="e.g., 28 June 2026" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">Location</label>
                  <input type="text" value={form.eventLocation} onChange={e => update("eventLocation", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg focus:ring-2 focus:ring-shen-primary focus:border-transparent outline-none" placeholder="Event venue" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">Speakers</label>
                <input type="text" value={form.eventSpeakers} onChange={e => update("eventSpeakers", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg focus:ring-2 focus:ring-shen-primary focus:border-transparent outline-none" placeholder="Comma-separated speaker names" />
              </div>
            </div>
          )}

          {/* Gallery-specific */}
          {form.category === "gallery" && (
            <div className="bg-white rounded-xl border border-shen-gray-100 p-6 space-y-5">
              <h2 className="font-bold text-shen-gray-900">Gallery Details</h2>
              <div>
                <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">Month (YYYY-MM)</label>
                <input type="text" value={form.galleryMonth} onChange={e => update("galleryMonth", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg focus:ring-2 focus:ring-shen-primary focus:border-transparent outline-none" placeholder="e.g., 2026-07" />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-shen-primary to-shen-accent text-white font-semibold rounded-lg hover:from-shen-primary-dark hover:to-shen-accent-dark transition-all disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Publication"}
            </button>
            <Link href="/admin/articles" className="px-6 py-3 text-shen-gray-600 hover:text-shen-gray-900">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewArticlePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-shen-gray-50 flex items-center justify-center"><div className="text-shen-gray-500">Loading...</div></div>}>
      <ArticleFormInner />
    </Suspense>
  );
}
