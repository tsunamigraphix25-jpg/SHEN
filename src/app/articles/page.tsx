import PublicLayout from "@/components/PublicLayout";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq, desc, and, or } from "drizzle-orm";
import { formatDate, categoryColor, categoryLabel } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const allArticles = await db
    .select()
    .from(articles)
    .where(
      and(
        eq(articles.status, "published"),
        or(eq(articles.category, "article"), eq(articles.category, "safety_report"), eq(articles.category, "training_material"))
      )
    )
    .orderBy(desc(articles.publishedAt));

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-shen-gray-900 mb-3">SHEN Articles</h1>
          <p className="text-shen-gray-600 max-w-2xl">
            Opinion pieces, educational articles, safety awareness content, professional insights, and training materials from SHEN contributors.
          </p>
        </div>

        {/* Articles Grid */}
        {allArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allArticles.map((article) => (
              <Link
                key={article.id}
                href={`/content/${article.slug}`}
                className="block bg-white rounded-xl border border-shen-gray-100 hover:shadow-lg transition-all overflow-hidden group"
              >
                <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600" />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${categoryColor(article.category)}`}>
                      {categoryLabel(article.category)}
                    </span>
                    <span className="text-xs text-shen-gray-400">{article.readingTime} min read</span>
                  </div>
                  <h3 className="font-bold text-shen-gray-900 group-hover:text-shen-purple transition-colors mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-shen-gray-600 line-clamp-3 mb-4">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-shen-gray-400 pt-3 border-t border-shen-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-shen-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-shen-purple font-semibold text-[10px]">
                          {article.authorName?.split(" ").map(n => n[0]).join("") || "?"}
                        </span>
                      </div>
                      <span>{article.authorName}</span>
                    </div>
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-shen-gray-50 rounded-xl">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="font-semibold text-shen-gray-900 mb-2">No articles yet</h3>
            <p className="text-shen-gray-500">Publish content from the admin portal to populate this section.</p>
            <Link href="/admin" className="inline-block mt-4 px-6 py-2 bg-shen-purple text-white rounded-lg hover:bg-shen-purple-dark transition-colors">
              Open Admin
            </Link>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
