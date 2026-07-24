"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditArticlePage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "article",
    status: "draft",
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/auth/check");
    if (!res.ok) router.push("/admin");
  }, [router]);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  useEffect(() => {
    fetch(`/api/articles/${id}`)
      .then(r => r.json())
      .then(data => {
        setForm({
          title: data.title || "",
          excerpt: data.excerpt || "",
          content: data.content || "",
          category: data.category || "article",
          status: data.status || "draft",
          authorName: data.authorName || "",
          authorPosition: data.authorPosition || "",
          readingTime: data.readingTime || 5,
          featured: data.featured || false,
          references: data.references || "",
          researchArea: data.researchArea || "",
          abstractText: data.abstractText || "",
          pdfUrl: data.pdfUrl || "",
          citation: data.citation || "",
          eventDate: data.eventDate || "",
          eventLocation: data.eventLocation || "",
          eventSpeakers: data.eventSpeakers || "",
          galleryMonth: data.galleryMonth || "",
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load article");
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }

      router.push("/admin/articles");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
      setSaving(false);
    }
  };

  const update = (field: string, value: string | number | boolean) => {
    setForm({ ...form, [field]: value });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-shen-gray-50 flex items-center justify-center">
        <div className="text-shen-gray-500">Loading article...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-shen-gray-50">
      <header className="bg-white border-b border-shen-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/admin/articles" className="text-shen-gray-500 hover:text-shen-purple">← Back</Link>
            <span className="text-shen-gray-300">/</span>
            <span className="font-semibold text-shen-gray-900">Edit Article</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

          <div className="bg-white rounded-xl border border-shen-gray-100 p-6 space-y-5">
            <h2 className="font-bold text-shen-gray-900">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">Category</label>
                <select value={form.category} onChange={e => update("category", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg outline-none bg-white">
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
                <select value={form.status} onChange={e => update("status", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg outline-none bg-white">
                  <option value="draft">Draft</option>
                  <option value="pending">Pending Review</option>
                  <option value="under_editing">Under Editing</option>
                  <option value="approved">Approved</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">Title</label>
              <input type="text" required value={form.title} onChange={e => update("title", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg outline-none" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">Excerpt</label>
              <textarea rows={2} value={form.excerpt} onChange={e => update("excerpt", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg outline-none resize-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">Author Name</label>
                <input type="text" value={form.authorName} onChange={e => update("authorName", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">Author Position</label>
                <input type="text" value={form.authorPosition} onChange={e => update("authorPosition", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">Reading Time (min)</label>
                <input type="number" min={1} value={form.readingTime} onChange={e => update("readingTime", parseInt(e.target.value) || 5)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg outline-none" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured" checked={form.featured} onChange={e => update("featured", e.target.checked)} className="w-4 h-4" />
              <label htmlFor="featured" className="text-sm font-medium text-shen-gray-700">Featured article</label>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-shen-gray-100 p-6 space-y-5">
            <h2 className="font-bold text-shen-gray-900">Content</h2>
            <textarea
              rows={15}
              required
              value={form.content}
              onChange={e => update("content", e.target.value)}
              className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg outline-none resize-y font-mono text-sm"
            />
            <div>
              <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">References</label>
              <textarea rows={3} value={form.references} onChange={e => update("references", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg outline-none resize-none" />
            </div>
          </div>

          {form.category === "research" && (
            <div className="bg-white rounded-xl border border-shen-gray-100 p-6 space-y-5">
              <h2 className="font-bold text-shen-gray-900">Research Details</h2>
              <textarea rows={4} value={form.abstractText} onChange={e => update("abstractText", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg outline-none resize-none" placeholder="Abstract" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input type="text" value={form.researchArea} onChange={e => update("researchArea", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg outline-none" placeholder="Research Area" />
                <input type="url" value={form.pdfUrl} onChange={e => update("pdfUrl", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg outline-none" placeholder="PDF URL" />
              </div>
              <input type="text" value={form.citation} onChange={e => update("citation", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg outline-none" placeholder="Citation" />
            </div>
          )}

          {form.category === "event" && (
            <div className="bg-white rounded-xl border border-shen-gray-100 p-6 space-y-5">
              <h2 className="font-bold text-shen-gray-900">Event Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input type="text" value={form.eventDate} onChange={e => update("eventDate", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg outline-none" placeholder="Event Date" />
                <input type="text" value={form.eventLocation} onChange={e => update("eventLocation", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg outline-none" placeholder="Location" />
              </div>
              <input type="text" value={form.eventSpeakers} onChange={e => update("eventSpeakers", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg outline-none" placeholder="Speakers" />
            </div>
          )}

          {form.category === "gallery" && (
            <div className="bg-white rounded-xl border border-shen-gray-100 p-6 space-y-5">
              <h2 className="font-bold text-shen-gray-900">Gallery Details</h2>
              <input type="text" value={form.galleryMonth} onChange={e => update("galleryMonth", e.target.value)} className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg outline-none" placeholder="Month (YYYY-MM)" />
            </div>
          )}

          <div className="flex items-center gap-4">
            <button type="submit" disabled={saving} className="px-6 py-3 bg-shen-purple text-white font-semibold rounded-lg hover:bg-shen-purple-dark transition-colors disabled:opacity-50">
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link href="/admin/articles" className="px-6 py-3 text-shen-gray-600 hover:text-shen-gray-900">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
