import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import slugify from "slugify";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const status = url.searchParams.get("status");
    const featured = url.searchParams.get("featured");
    const search = url.searchParams.get("search");
    const limit = parseInt(url.searchParams.get("limit") || "50");

    const conditions = [];

    if (category) {
      conditions.push(eq(articles.category, category as "article" | "research" | "news" | "event" | "gallery" | "safety_report" | "training_material"));
    }
    if (status) {
      conditions.push(eq(articles.status, status as "draft" | "pending" | "under_editing" | "approved" | "published"));
    }
    if (featured === "true") {
      conditions.push(eq(articles.featured, true));
    }
    if (search) {
      conditions.push(
        sql`(${articles.title} ILIKE ${'%' + search + '%'} OR ${articles.excerpt} ILIKE ${'%' + search + '%'})`
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const results = await db
      .select()
      .from(articles)
      .where(where)
      .orderBy(desc(articles.publishedAt), desc(articles.createdAt))
      .limit(limit);

    return NextResponse.json(results);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "editor")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const slug = slugify(data.title, { lower: true, strict: true });

    const result = await db.insert(articles).values({
      title: data.title,
      slug: slug + "-" + Date.now(),
      excerpt: data.excerpt || null,
      content: data.content || "",
      category: data.category || "article",
      status: data.status || "draft",
      coverImage: data.coverImage || null,
      authorId: session.id,
      authorName: data.authorName || session.name,
      authorPosition: data.authorPosition || null,
      readingTime: data.readingTime || 5,
      featured: data.featured || false,
      references: data.references || null,
      researchArea: data.researchArea || null,
      abstractText: data.abstractText || null,
      pdfUrl: data.pdfUrl || null,
      citation: data.citation || null,
      eventDate: data.eventDate || null,
      eventLocation: data.eventLocation || null,
      eventSpeakers: data.eventSpeakers || null,
      galleryMonth: data.galleryMonth || null,
      publishedAt: data.status === "published" ? new Date() : null,
    }).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
