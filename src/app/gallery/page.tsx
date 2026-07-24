import PublicLayout from "@/components/PublicLayout";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const allGalleries = await db
    .select()
    .from(articles)
    .where(and(eq(articles.status, "published"), eq(articles.category, "gallery")))
    .orderBy(desc(articles.publishedAt));

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-shen-gray-900 mb-3">Monthly Pictorial Highlights</h1>
          <p className="text-shen-gray-600 max-w-2xl">
            A visual journey through SHEN activities — member activities, training sessions, community engagement, and behind the scenes.
          </p>
        </div>

        {allGalleries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allGalleries.map((gallery) => (
              <Link key={gallery.id} href={`/content/${gallery.slug}`} className="block bg-white rounded-xl border border-shen-gray-100 hover:shadow-lg transition-all overflow-hidden group">
                <div className="h-40 bg-gradient-to-br from-pink-100 via-purple-100 to-shen-purple-100 flex items-center justify-center">
                  <span className="text-5xl">📸</span>
                </div>
                <div className="p-5">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-pink-100 text-pink-800 mb-2">
                    Gallery
                  </span>
                  <h3 className="font-bold text-shen-gray-900 group-hover:text-shen-purple transition-colors mb-1">
                    {gallery.title}
                  </h3>
                  <p className="text-sm text-shen-gray-600 line-clamp-2 mb-3">{gallery.excerpt}</p>
                  <div className="text-xs text-shen-gray-400">
                    {gallery.galleryMonth && <span>Month: {gallery.galleryMonth}</span>}
                    {!gallery.galleryMonth && <span>{formatDate(gallery.publishedAt)}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-shen-gray-50 rounded-xl">
            <div className="text-4xl mb-3">📸</div>
            <h3 className="font-semibold text-shen-gray-900 mb-2">No galleries yet</h3>
            <p className="text-shen-gray-500">Monthly highlights will appear here!</p>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
