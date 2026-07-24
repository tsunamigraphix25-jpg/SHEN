import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import bcrypt from "bcryptjs";
import { users } from "./schema";

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  const db = drizzle(pool);

  const adminHash = await bcrypt.hash("admin123", 10);

  await db.insert(users).values({
    email: "admin@shen.org",
    passwordHash: adminHash,
    name: "SHEN Administrator",
    role: "admin",
    shenRole: "Platform Administrator",
    academicBackground: "MSc Occupational Health & Safety",
    bio: "Platform administrator for SHEN Knowledge Hub.",
  }).onConflictDoNothing();

  await pool.end();
  console.log("✅ Admin user created successfully!");
  console.log("   Email: admin@shen.org");
  console.log("   Password: admin123");
}

seed().catch(console.error);
