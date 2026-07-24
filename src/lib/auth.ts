import { cookies } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const SESSION_COOKIE = "shen_session";

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session?.value) return null;

  try {
    const data = JSON.parse(Buffer.from(session.value, "base64").toString());
    if (!data.userId) return null;

    const user = await db.select().from(users).where(eq(users.id, data.userId)).limit(1);
    if (!user.length) return null;

    return {
      id: user[0].id,
      email: user[0].email,
      name: user[0].name,
      role: user[0].role,
    };
  } catch {
    return null;
  }
}

export function createSessionToken(userId: number): string {
  return Buffer.from(JSON.stringify({ userId, ts: Date.now() })).toString("base64");
}
