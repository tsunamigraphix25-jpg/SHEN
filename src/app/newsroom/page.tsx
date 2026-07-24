import PublicLayout from "@/components/PublicLayout";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NewsroomPage() {
  const allNews = await db
    .select()
    .from(articles)
    .where(and(eq(articles.status, "published"), eq(articles.category, "news")))
    .orderBy(desc(articles.publishedAt));

  return (
    <PublicLayout>
      <div className="bg-shen-gray-900 text-white py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">SHEN Newsroom</h1>
          <p className="text-shen-gray-300 max-w-2xl">
            Stay updated with the latest from SHEN — partnerships, committee announcements, membership updates, projects, achievements, and industry engagements.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {allNews.length > 0 ? (
          <div className="space-y-6">
            {allNews.map((news, i) => (
              <Link key={news.id} href={`/content/${news.slug}`} className="block group">
                <div className={`bg-white rounded-xl border border-shen-gray-100 hover:shadow-lg transition-all overflow-hidden ${i === 0 ? "p-8" : "p-6"}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">News</span>
                    <span className="text-xs text-shen-gray-400">{formatDate(news.publishedAt)}</span>
                  </div>
                  <h2 className={`font-bold text-shen-gray-900 group-hover:text-shen-purple transition-colors mb-2 ${i === 0 ? "text-2xl" : "text-lg"}`}>
                    {news.title}
                  </h2>
                  <p className={`text-shen-gray-600 ${i === 0 ? "text-base" : "text-sm"} line-clamp-3`}>{news.excerpt}</p>
                  <div className="flex items-center gap-2 mt-3 text-sm text-shen-gray-500">
                    <span>{news.authorName}</span>
                    <span>·</span>
                    <span>{news.readingTime} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-shen-gray-50 rounded-xl">
            <div className="text-4xl mb-3">📰</div>
            <h3 className="font-semibold text-shen-gray-900 mb-2">No news updates yet</h3>
            <p className="text-shen-gray-500">Check back soon for the latest SHEN news!</p>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
