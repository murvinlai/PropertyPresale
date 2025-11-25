
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("GUEST"), // GUEST, MEMBER, AGENT, ADMIN
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const listings = pgTable("listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  project: text("project").notNull(),
  neighborhood: text("neighborhood").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  sqft: integer("sqft").notNull(),
  floor: integer("floor").notNull(),
  completion: text("completion").notNull(),
  developer: text("developer").notNull(),
  developerInitials: text("developer_initials").notNull(),
  originalPrice: integer("original_price").notNull(),
  askingPrice: integer("asking_price").notNull(),
  depositPaid: integer("deposit_paid").notNull(),
  assignmentFee: decimal("assignment_fee", { precision: 5, scale: 2 }).notNull(),
  contractDate: timestamp("contract_date").notNull(),
  images: text("images").array().notNull().default(sql`ARRAY[]::text[]`),
  floorplan: text("floorplan"),
  views: integer("views").notNull().default(0),
  inquiries: integer("inquiries").notNull().default(0),
  status: text("status").notNull().default("ACTIVE"), // ACTIVE, PENDING, SOLD
  isVerified: boolean("is_verified").notNull().default(false),
  leadPoolStatus: text("lead_pool_status").notNull().default("NOT_IN_POOL"), // NOT_IN_POOL, TIER_1, TIER_2, CLAIMED
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true,
});

export const insertListingSchema = createInsertSchema(listings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;
export type Listing = typeof listings.$inferSelect;
