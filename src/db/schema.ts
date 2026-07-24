import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  serial,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enums
export const contentStatusEnum = pgEnum("content_status", [
  "draft",
  "pending",
  "under_editing",
  "approved",
  "published",
]);

export const contentCategoryEnum = pgEnum("content_category", [
  "article",
  "research",
  "news",
  "event",
  "gallery",
  "safety_report",
  "training_material",
]);

export const userRoleEnum = pgEnum("user_role", ["admin", "editor", "member"]);

// Admin users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: userRoleEnum("role").notNull().default("member"),
  picture: text("picture"),
  academicBackground: text("academic_background"),
  shenRole: text("shen_role"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Articles / Content
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  category: contentCategoryEnum("category").notNull().default("article"),
  status: contentStatusEnum("status").notNull().default("draft"),
  coverImage: text("cover_image"),
  authorId: integer("author_id").references(() => users.id),
  authorName: text("author_name"),
  authorPosition: text("author_position"),
  readingTime: integer("reading_time").default(5),
  featured: boolean("featured").default(false),
  references: text("references"),
  researchArea: text("research_area"),
  abstractText: text("abstract_text"),
  pdfUrl: text("pdf_url"),
  citation: text("citation"),
  eventDate: text("event_date"),
  eventLocation: text("event_location"),
  eventSpeakers: text("event_speakers"),
  galleryMonth: text("gallery_month"),
  viewCount: integer("view_count").default(0),
  downloadCount: integer("download_count").default(0),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Gallery images
export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  articleId: integer("article_id").references(() => articles.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  photographer: text("photographer"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Content submissions
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  shenPosition: text("shen_position"),
  email: text("email").notNull(),
  category: contentCategoryEnum("category").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  references: text("references"),
  status: contentStatusEnum("status").notNull().default("pending"),
  reviewNotes: text("review_notes"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
