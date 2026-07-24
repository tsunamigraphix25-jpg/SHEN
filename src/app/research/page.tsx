import PublicLayout from "@/components/PublicLayout";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ResearchPage() {
  const allResearch = await db
    .select()
    .from(articles)
    .where(and(eq(articles.status, "published"), eq(articles.category, "research")))
    .orderBy(desc(articles.publishedAt));

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-shen-gray-900 mb-3">Research & Academic Publications</h1>
          <p className="text-shen-gray-600 max-w-2xl">
            A digital library of research papers, case studies, literature reviews, environmental studies, and safety research from SHEN contributors.
          </p>
        </div>

        {allResearch.length > 0 ? (
          <div className="space-y-6">
            {allResearch.map((paper) => (
              <Link key={paper.id} href={`/content/${paper.slug}`} className="block bg-white rounded-xl border border-shen-gray-100 hover:shadow-lg transition-all p-6 group">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📄</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-shen-gray-900 group-hover:text-shen-purple transition-colors mb-2">
                      {paper.title}
                    </h3>
                    {paper.abstractText && (
                      <p className="text-sm text-shen-gray-600 mb-3 line-clamp-3">{paper.abstractText}</p>
                    )}
                    {!paper.abstractText && paper.excerpt && (
                      <p className="text-sm text-shen-gray-600 mb-3 line-clamp-3">{paper.excerpt}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-shen-gray-500">
                      <span className="flex items-center gap-1">👤 {paper.authorName}</span>
                      {paper.researchArea && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">{paper.researchArea}</span>
                      )}
                      <span>{formatDate(paper.publishedAt)}</span>
                      <span>{paper.viewCount} views</span>
                      {paper.downloadCount !== null && paper.downloadCount > 0 && (
                        <span>{paper.downloadCount} downloads</span>
                      )}
                    </div>
                    {paper.citation && (
                      <p className="text-xs text-shen-gray-400 italic mt-2">{paper.citation}</p>
                    )}
                  </div>
                  {paper.pdfUrl && (
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-shen-purple text-white text-xs font-medium rounded-lg">
                        📥 PDF
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-shen-gray-50 rounded-xl">
            <div className="text-4xl mb-3">🔬</div>
            <h3 className="font-semibold text-shen-gray-900 mb-2">No research publications yet</h3>
            <p className="text-shen-gray-500">Add research items from the admin dashboard using Google Drive PDF links.</p>
            <Link href="/admin" className="inline-block mt-4 px-6 py-2 bg-shen-purple text-white rounded-lg">Open Admin</Link>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
