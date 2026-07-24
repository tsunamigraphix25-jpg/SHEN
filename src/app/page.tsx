import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { formatDate, categoryLabel, categoryColor } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredArticle = await db
    .select()
    .from(articles)
    .where(and(eq(articles.status, "published"), eq(articles.featured, true)))
    .orderBy(desc(articles.publishedAt))
    .limit(1);

  const latestArticles = await db
    .select()
    .from(articles)
    .where(eq(articles.status, "published"))
    .orderBy(desc(articles.publishedAt))
    .limit(6);

  const latestNews = await db
    .select()
    .from(articles)
    .where(and(eq(articles.status, "published"), eq(articles.category, "news")))
    .orderBy(desc(articles.publishedAt))
    .limit(3);

  const upcomingEvents = await db
    .select()
    .from(articles)
    .where(and(eq(articles.status, "published"), eq(articles.category, "event")))
    .orderBy(desc(articles.publishedAt))
    .limit(3);

  const featured = featuredArticle[0] || latestArticles[0];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-shen-900 via-shen-primary to-shen-primary-light text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-shen-accent rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-shen-accent rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm mb-6">
              <span className="w-2 h-2 bg-shen-accent rounded-full animate-pulse" />
              Safety, Health and Environment Network
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Advancing Safety, Health and Environmental Excellence Through Knowledge
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed max-w-2xl">
              The official publication and knowledge-sharing platform of the Safety, Health and Environment Network (SHEN).
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/articles"
                className="px-6 py-3 bg-white text-shen-primary font-semibold rounded-lg hover:bg-white/90 transition-colors"
              >
                Read Articles
              </Link>
              <Link
                href="/admin"
                className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Admin Login
              </Link>
              <Link
                href="/research"
                className="px-6 py-3 border-2 border-shen-accent text-shen-accent font-semibold rounded-lg hover:bg-shen-accent/10 transition-colors"
              >
                Explore Research
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featured && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <Link href={`/content/${featured.slug}`} className="block">
            <div className="bg-white rounded-2xl shadow-xl border border-shen-gray-100 overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-gradient-to-r from-shen-primary to-shen-accent text-white text-xs font-semibold rounded-full">
                    Featured
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${categoryColor(featured.category)}`}>
                    {categoryLabel(featured.category)}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-shen-gray-900 mb-3">
                  {featured.title}
                </h2>
                <p className="text-shen-gray-600 mb-4 line-clamp-2 max-w-3xl">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-shen-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {featured.authorName}
                  </span>
                  <span>{formatDate(featured.publishedAt)}</span>
                  <span>{featured.readingTime} min read</span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Published Articles", value: latestArticles.length + "+", icon: "📄" },
            { label: "Research Papers", value: "Growing", icon: "🔬" },
            { label: "Active Contributors", value: "3+", icon: "👥" },
            { label: "Knowledge Areas", value: "7", icon: "📚" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 bg-gradient-to-br from-shen-50 to-lime-50 rounded-xl border border-shen-100">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold text-shen-primary">{stat.value}</div>
              <div className="text-sm text-shen-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Publications */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-shen-gray-900">Latest Publications</h2>
            <p className="text-shen-gray-500 mt-1">Recent articles, research, and insights from SHEN</p>
          </div>
          <Link href="/articles" className="text-shen-primary hover:text-shen-primary-dark font-medium text-sm hidden md:block">
            View All →
          </Link>
        </div>
        {latestArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-shen-gray-50 rounded-xl">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="font-semibold text-shen-gray-900 mb-2">No articles yet</h3>
            <p className="text-shen-gray-500">Be the first to contribute content!</p>
            <Link href="/admin" className="inline-block mt-4 px-6 py-2 bg-shen-primary text-white rounded-lg">
              Go to Admin
            </Link>
          </div>
        )}
      </section>

      {/* SHEN Updates & Events */}
      <section className="bg-shen-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* News */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-shen-gray-900">SHEN Updates</h2>
                <Link href="/newsroom" className="text-shen-primary text-sm font-medium">More →</Link>
              </div>
              <div className="space-y-4">
                {latestNews.length > 0 ? latestNews.map((news) => (
                  <Link key={news.id} href={`/content/${news.slug}`} className="block bg-white p-4 rounded-xl hover:shadow-md transition-shadow border border-shen-gray-100">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full mb-2 ${categoryColor("news")}`}>
                      News
                    </span>
                    <h3 className="font-semibold text-shen-gray-900 mb-1">{news.title}</h3>
                    <p className="text-sm text-shen-gray-500 line-clamp-2">{news.excerpt}</p>
                    <div className="text-xs text-shen-gray-400 mt-2">{formatDate(news.publishedAt)}</div>
                  </Link>
                )) : (
                  <div className="bg-white p-6 rounded-xl border border-shen-gray-100 text-center text-shen-gray-500">
                    No news updates yet. Create news in Admin.
                  </div>
                )}
              </div>
            </div>

            {/* Events */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-shen-gray-900">Events & Activities</h2>
                <Link href="/events" className="text-shen-primary text-sm font-medium">More →</Link>
              </div>
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
                  <Link key={event.id} href={`/content/${event.slug}`} className="block bg-white p-4 rounded-xl hover:shadow-md transition-shadow border border-shen-gray-100">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full mb-2 ${categoryColor("event")}`}>
                      Event
                    </span>
                    <h3 className="font-semibold text-shen-gray-900 mb-1">{event.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-shen-gray-500 mt-2">
                      {event.eventDate && <span>📅 {event.eventDate}</span>}
                      {event.eventLocation && <span>📍 {event.eventLocation}</span>}
                    </div>
                  </Link>
                )) : (
                  <div className="bg-white p-6 rounded-xl border border-shen-gray-100 text-center text-shen-gray-500">
                    No events listed yet. Create events in Admin.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-shen-gray-900">Explore Knowledge Areas</h2>
          <p className="text-shen-gray-500 mt-2">Browse content across all HSE disciplines</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "SHEN Articles", desc: "Opinion pieces, educational articles, and professional insights", icon: "📝", href: "/articles", color: "border-emerald-200 bg-emerald-50/50" },
            { title: "Research & Publications", desc: "Research papers, case studies, literature reviews", icon: "🔬", href: "/research", color: "border-lime-200 bg-lime-50/50" },
            { title: "SHEN Newsroom", desc: "Organizational updates, partnerships, achievements", icon: "📰", href: "/newsroom", color: "border-green-200 bg-green-50/50" },
            { title: "Events & Activities", desc: "OSHE Talks, workshops, webinars, campaigns", icon: "📅", href: "/events", color: "border-teal-200 bg-teal-50/50" },
            { title: "Monthly Highlights", desc: "Visual galleries of SHEN activities", icon: "📸", href: "/gallery", color: "border-cyan-200 bg-cyan-50/50" },
            { title: "Admin Portal", desc: "Publish and manage content from one secure dashboard", icon: "🔐", href: "/admin", color: "border-shen-200 bg-shen-50" },
          ].map((cat) => (
            <Link key={cat.title} href={cat.href} className={`block p-6 rounded-xl border-2 ${cat.color} hover:shadow-lg transition-all group`}>
              <div className="text-3xl mb-3">{cat.icon}</div>
              <h3 className="font-bold text-shen-gray-900 group-hover:text-shen-primary transition-colors">{cat.title}</h3>
              <p className="text-sm text-shen-gray-600 mt-1">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-shen-primary to-shen-primary-light text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Manage the Blog from One Admin Dashboard</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Use the admin portal to publish articles, research papers, news, and events directly to the SHEN blog.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/admin"
              className="px-6 py-3 bg-white text-shen-primary font-semibold rounded-lg hover:bg-white/90 transition-colors"
            >
              Open Admin Portal
            </Link>
            <Link
              href="/contributors"
              className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Meet Our Contributors
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function ArticleCard({ article }: { article: typeof articles.$inferSelect }) {
  return (
    <Link href={`/content/${article.slug}`} className="block bg-white rounded-xl border border-shen-gray-100 hover:shadow-lg transition-all overflow-hidden group">
      <div className="h-2 bg-gradient-to-r from-shen-primary to-shen-accent" />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${categoryColor(article.category)}`}>
            {categoryLabel(article.category)}
          </span>
          <span className="text-xs text-shen-gray-400">{article.readingTime} min read</span>
        </div>
        <h3 className="font-bold text-shen-gray-900 group-hover:text-shen-primary transition-colors mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-shen-gray-600 line-clamp-2 mb-3">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-shen-gray-400">
          <span>{article.authorName}</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}
