import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { submissions } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "editor")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results = await db
      .select()
      .from(submissions)
      .orderBy(desc(submissions.createdAt));

    return NextResponse.json(results);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.fullName || !data.email || !data.title || !data.category) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const result = await db.insert(submissions).values({
      fullName: data.fullName,
      shenPosition: data.shenPosition || null,
      email: data.email,
      category: data.category,
      title: data.title,
      description: data.description || null,
      content: data.content || null,
      references: data.references || null,
      status: "pending",
    }).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
