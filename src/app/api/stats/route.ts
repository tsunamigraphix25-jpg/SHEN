import { NextResponse } from "next/server";
import { db } from "@/db";
import { articles, users } from "@/db/schema";
import { eq, count, sum } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "editor")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [totalArticles] = await db.select({ count: count() }).from(articles);
    const [publishedArticles] = await db.select({ count: count() }).from(articles).where(eq(articles.status, "published"));
    const [totalViews] = await db.select({ total: sum(articles.viewCount) }).from(articles);
    const [totalDownloads] = await db.select({ total: sum(articles.downloadCount) }).from(articles);
    const [totalMembers] = await db.select({ count: count() }).from(users);

    return NextResponse.json({
      totalArticles: totalArticles.count,
      publishedArticles: publishedArticles.count,
      totalViews: Number(totalViews.total || 0),
      totalDownloads: Number(totalDownloads.total || 0),
      totalMembers: totalMembers.count,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
