import { db, pool } from "./db";
import { eq, or, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { users, listings, type User, type InsertUser, type Listing, type InsertListing } from "@shared/schema";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>; // For seed/admin
  createUser(user: InsertUser & { password?: string; googleId?: string; role?: string }): Promise<User>;
  updateUserRole(id: number, role: "GUEST" | "AGENT" | "ADMIN" | "SUPERADMIN"): Promise<User>;
  deactivateUser(id: number): Promise<User>;

  getListings(): Promise<Listing[]>;
  getAllListings(): Promise<Listing[]>; // For compatibility with older routes
  getListing(id: number): Promise<Listing | undefined>;
  createListing(listing: InsertListing): Promise<Listing>;
  updateListing(id: number, updates: Partial<Listing>): Promise<Listing | undefined>;
  updateListingStatus(id: number, status: string): Promise<Listing>;
  deleteListing(id: number): Promise<boolean>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(
      and(eq(users.username, username), eq(users.isActive, true))
    );
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(
      and(eq(users.email, email), eq(users.isActive, true))
    );
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(insertUser: InsertUser & { password?: string; googleId?: string; role?: string }): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserRole(id: number, role: "GUEST" | "AGENT" | "ADMIN" | "SUPERADMIN"): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, id))
      .returning();
    if (!user) throw new Error("User not found");
    return user;
  }

  async deactivateUser(id: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ isActive: false })
      .where(eq(users.id, id))
      .returning();
    if (!user) throw new Error("User not found");
    return user;
  }

  async getListings(): Promise<Listing[]> {
    return await db.select().from(listings);
  }

  async getAllListings(): Promise<Listing[]> {
    return this.getListings();
  }

  async getListing(id: number): Promise<Listing | undefined> {
    const [listing] = await db.select().from(listings).where(eq(listings.id, id));
    return listing;
  }

  async createListing(insertListing: InsertListing): Promise<Listing> {
    const [listing] = await db.insert(listings).values(insertListing).returning();
    return listing;
  }

  async updateListing(id: number, updates: Partial<Listing>): Promise<Listing | undefined> {
    const [listing] = await db
      .update(listings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(listings.id, id))
      .returning();
    return listing;
  }

  async updateListingStatus(id: number, status: string): Promise<Listing> {
    const [listing] = await db
      .update(listings)
      .set({ status, updatedAt: new Date() })
      .where(eq(listings.id, id))
      .returning();
    if (!listing) throw new Error("Listing not found");
    return listing;
  }

  async deleteListing(id: number): Promise<boolean> {
    const result = await db.delete(listings).where(eq(listings.id, id)).returning();
    return result.length > 0;
  }
}

// Initialize storage
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

export const storage = new DatabaseStorage();
