import PublicLayout from "@/components/PublicLayout";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const allEvents = await db
    .select()
    .from(articles)
    .where(and(eq(articles.status, "published"), eq(articles.category, "event")))
    .orderBy(desc(articles.publishedAt));

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-shen-gray-900 mb-3">Events & Activities</h1>
          <p className="text-shen-gray-600 max-w-2xl">
            Explore SHEN&apos;s event archive — OSHE Talks, workshops, webinars, safety campaigns, and industry visits.
          </p>
        </div>

        {allEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allEvents.map((event) => (
              <Link key={event.id} href={`/content/${event.slug}`} className="block bg-white rounded-xl border border-shen-gray-100 hover:shadow-lg transition-all overflow-hidden group">
                <div className="h-2 bg-gradient-to-r from-orange-400 to-orange-600" />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-800">Event</span>
                  </div>
                  <h3 className="font-bold text-lg text-shen-gray-900 group-hover:text-shen-purple transition-colors mb-3">
                    {event.title}
                  </h3>
                  <p className="text-sm text-shen-gray-600 line-clamp-2 mb-4">{event.excerpt}</p>
                  <div className="space-y-2 text-sm text-shen-gray-500">
                    {event.eventDate && (
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>{event.eventDate}</span>
                      </div>
                    )}
                    {event.eventLocation && (
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{event.eventLocation}</span>
                      </div>
                    )}
                    {event.eventSpeakers && (
                      <div className="flex items-center gap-2">
                        <span>🎤</span>
                        <span className="line-clamp-2">{event.eventSpeakers}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-shen-gray-400 mt-4 pt-3 border-t border-shen-gray-100">
                    <span>{event.authorName}</span>
                    <span>{formatDate(event.publishedAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-shen-gray-50 rounded-xl">
            <div className="text-4xl mb-3">📅</div>
            <h3 className="font-semibold text-shen-gray-900 mb-2">No events yet</h3>
            <p className="text-shen-gray-500">Stay tuned for upcoming SHEN events!</p>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
