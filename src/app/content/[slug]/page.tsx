import PublicLayout from "@/components/PublicLayout";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq, and, desc, ne } from "drizzle-orm";
import { formatDate, categoryLabel, categoryColor, renderMarkdown } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params;

  const result = await db
    .select()
    .from(articles)
    .where(eq(articles.slug, slug))
    .limit(1);

  if (!result.length) notFound();

  const article = result[0];

  // Increment view
  await db
    .update(articles)
    .set({ viewCount: sql`${articles.viewCount} + 1` })
    .where(eq(articles.id, article.id));

  // Related articles
  const related = await db
    .select()
    .from(articles)
    .where(and(eq(articles.category, article.category), eq(articles.status, "published"), ne(articles.id, article.id)))
    .orderBy(desc(articles.publishedAt))
    .limit(3);

  const contentHtml = renderMarkdown(article.content);

  return (
    <PublicLayout>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-shen-gray-500 mb-6">
          <Link href="/" className="hover:text-shen-primary">Home</Link>
          <span>/</span>
          <Link href={`/${article.category === "news" ? "newsroom" : article.category === "event" ? "events" : article.category === "research" ? "research" : article.category === "gallery" ? "gallery" : "articles"}`} className="hover:text-shen-primary">
            {categoryLabel(article.category)}
          </Link>
          <span>/</span>
          <span className="text-shen-gray-700 truncate">{article.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${categoryColor(article.category)}`}>
              {categoryLabel(article.category)}
            </span>
            {article.featured && (
              <span className="px-3 py-1 bg-gradient-to-r from-shen-primary to-shen-accent text-white text-xs font-semibold rounded-full">
                Featured
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-shen-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-lg text-shen-gray-600 mb-6 leading-relaxed">
              {article.excerpt}
            </p>
          )}

          {article.coverImage && (
            <div className="mb-8 overflow-hidden rounded-2xl border border-shen-gray-200 bg-shen-gray-50">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-shen-gray-500 pb-6 border-b border-shen-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-shen-100 rounded-full flex items-center justify-center">
                <span className="text-shen-primary font-semibold text-xs">
                  {article.authorName?.split(" ").map(n => n[0]).join("") || "?"}
                </span>
              </div>
              <div>
                <div className="font-medium text-shen-gray-900">{article.authorName || "SHEN Team"}</div>
                {article.authorPosition && (
                  <div className="text-xs text-shen-gray-500">{article.authorPosition}</div>
                )}
              </div>
            </div>
            <span className="text-shen-gray-300">|</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span className="text-shen-gray-300">|</span>
            <span>{article.readingTime} min read</span>
            <span className="text-shen-gray-300">|</span>
            <span>{article.viewCount} views</span>
          </div>
        </header>

        {/* Research-specific fields */}
        {article.category === "research" && (
          <div className="bg-lime-50 rounded-xl p-6 mb-8 border border-lime-100">
            {article.abstractText && (
              <div className="mb-4">
                <h3 className="font-semibold text-shen-gray-900 mb-2">Abstract</h3>
                <p className="text-shen-gray-700 leading-relaxed">{article.abstractText}</p>
              </div>
            )}
            {article.researchArea && (
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-shen-gray-900 text-sm">Research Area:</span>
                <span className="text-sm text-shen-gray-700">{article.researchArea}</span>
              </div>
            )}
            {article.citation && (
              <div className="mt-3">
                <span className="font-semibold text-shen-gray-900 text-sm">Citation:</span>
                <p className="text-sm text-shen-gray-600 italic mt-1">{article.citation}</p>
              </div>
            )}
            {article.pdfUrl && (
              <a
                href={article.pdfUrl}
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-shen-primary text-white text-sm font-medium rounded-lg hover:bg-shen-primary-dark transition-colors"
              >
                📥 Download PDF ({article.downloadCount || 0} downloads)
              </a>
            )}
          </div>
        )}

        {/* Event-specific fields */}
        {article.category === "event" && (
          <div className="bg-teal-50 rounded-xl p-6 mb-8 border border-teal-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {article.eventDate && (
                <div>
                  <span className="font-semibold text-shen-gray-900 text-sm">📅 Date</span>
                  <p className="text-shen-gray-700">{article.eventDate}</p>
                </div>
              )}
              {article.eventLocation && (
                <div>
                  <span className="font-semibold text-shen-gray-900 text-sm">📍 Location</span>
                  <p className="text-shen-gray-700">{article.eventLocation}</p>
                </div>
              )}
              {article.eventSpeakers && (
                <div className="sm:col-span-2">
                  <span className="font-semibold text-shen-gray-900 text-sm">🎤 Speakers</span>
                  <p className="text-shen-gray-700">{article.eventSpeakers}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />

        {/* References */}
        {article.references && (
          <div className="mt-8 p-6 bg-shen-gray-50 rounded-xl">
            <h3 className="font-semibold text-shen-gray-900 mb-2">References</h3>
            <p className="text-sm text-shen-gray-600">{article.references}</p>
          </div>
        )}

        {/* Share buttons */}
        <div className="mt-8 pt-6 border-t border-shen-gray-200">
          <h3 className="font-semibold text-shen-gray-900 mb-3">Share this article</h3>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
              LinkedIn
            </button>
            <button className="px-4 py-2 bg-blue-400 text-white text-sm rounded-lg hover:bg-blue-500 transition-colors">
              Twitter
            </button>
            <button className="px-4 py-2 bg-shen-gray-200 text-shen-gray-700 text-sm rounded-lg hover:bg-shen-gray-300 transition-colors">
              Copy Link
            </button>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="bg-shen-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-shen-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link key={r.id} href={`/content/${r.slug}`} className="block bg-white p-5 rounded-xl border border-shen-gray-100 hover:shadow-md transition-shadow">
                  <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full mb-2 ${categoryColor(r.category)}`}>
                    {categoryLabel(r.category)}
                  </span>
                  <h3 className="font-semibold text-shen-gray-900 mb-1 line-clamp-2">{r.title}</h3>
                  <p className="text-sm text-shen-gray-500">{formatDate(r.publishedAt)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PublicLayout>
  );
}
