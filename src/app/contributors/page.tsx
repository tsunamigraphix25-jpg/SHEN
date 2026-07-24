import PublicLayout from "@/components/PublicLayout";
import { db } from "@/db";
import { users, articles } from "@/db/schema";
import { eq, count } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function ContributorsPage() {
  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      picture: users.picture,
      academicBackground: users.academicBackground,
      shenRole: users.shenRole,
      bio: users.bio,
    })
    .from(users);

  const articleCounts = await db
    .select({
      authorId: articles.authorId,
      count: count(),
    })
    .from(articles)
    .where(eq(articles.status, "published"))
    .groupBy(articles.authorId);

  const countMap = new Map(articleCounts.map(ac => [ac.authorId, Number(ac.count)]));

  const contributors = allUsers.map(u => ({
    ...u,
    articleCount: countMap.get(u.id) || 0,
  }));

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-shen-gray-900 mb-3">Our Contributors</h1>
          <p className="text-shen-gray-600 max-w-2xl">
            Meet the SHEN members who contribute their knowledge and expertise to advance safety, health, and environmental excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contributors.map((member) => (
            <div key={member.id} className="bg-white rounded-xl border border-shen-gray-100 p-6 hover:shadow-lg transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-shen-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-shen-purple font-bold text-xl">
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-shen-gray-900">{member.name}</h3>
                  {member.shenRole && (
                    <p className="text-sm text-shen-purple font-medium">{member.shenRole}</p>
                  )}
                </div>
              </div>
              {member.academicBackground && (
                <div className="mb-3">
                  <span className="text-xs font-semibold text-shen-gray-500 uppercase tracking-wide">Academic Background</span>
                  <p className="text-sm text-shen-gray-700 mt-0.5">{member.academicBackground}</p>
                </div>
              )}
              {member.bio && (
                <p className="text-sm text-shen-gray-600 mb-3">{member.bio}</p>
              )}
              <div className="pt-3 border-t border-shen-gray-100">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-shen-gray-500">
                    <span>📄</span>
                    <span>{member.articleCount} publication{member.articleCount !== 1 ? "s" : ""}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
