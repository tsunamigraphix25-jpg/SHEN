import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, articles } from "@/db/schema";
import { eq, count } from "drizzle-orm";

export async function GET() {
  try {
    const allUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      picture: users.picture,
      academicBackground: users.academicBackground,
      shenRole: users.shenRole,
      bio: users.bio,
      createdAt: users.createdAt,
    }).from(users);

    // Get article counts per user
    const articleCounts: Array<{ authorId: number | null; count: number | string | bigint | null }> = await db
      .select({
        authorId: articles.authorId,
        count: count(),
      })
      .from(articles)
      .where(eq(articles.status, "published"))
      .groupBy(articles.authorId);

    const countMap = new Map<number, number>(
      articleCounts
        .filter((ac): ac is { authorId: number; count: number | string | bigint | null } => ac.authorId !== null)
        .map((ac) => [ac.authorId, Number(ac.count)]),
    );

    const result = allUsers.map((u) => ({
      ...u,
      articleCount: countMap.get(u.id) || 0,
    }));

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
