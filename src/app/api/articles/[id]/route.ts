import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = parseInt(id);

    let result;
    if (isNaN(numId)) {
      // Treat as slug
      result = await db.select().from(articles).where(eq(articles.slug, id)).limit(1);
    } else {
      result = await db.select().from(articles).where(eq(articles.id, numId)).limit(1);
    }

    if (!result.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Increment view count
    await db.update(articles)
      .set({ viewCount: sql`${articles.viewCount} + 1` })
      .where(eq(articles.id, result[0].id));

    return NextResponse.json(result[0]);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "editor")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();

    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    const fields = [
      "title", "excerpt", "content", "category", "status", "coverImage",
      "authorName", "authorPosition", "readingTime", "featured", "references",
      "researchArea", "abstractText", "pdfUrl", "citation", "eventDate",
      "eventLocation", "eventSpeakers", "galleryMonth",
    ];

    for (const field of fields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    if (data.status === "published" && !data.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const result = await db
      .update(articles)
      .set(updateData)
      .where(eq(articles.id, parseInt(id)))
      .returning();

    if (!result.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await db.delete(articles).where(eq(articles.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
