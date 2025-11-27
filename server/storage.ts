
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { eq } from 'drizzle-orm';
import { users, listings, type User, type InsertUser, type Listing, type InsertListing } from "@shared/schema";

// Configure WebSocket for Neon serverless
neonConfig.webSocketConstructor = ws;

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  
  // Listings
  getListing(id: string): Promise<Listing | undefined>;
  getAllListings(): Promise<Listing[]>;
  createListing(listing: InsertListing): Promise<Listing>;
  updateListing(id: string, updates: Partial<Listing>): Promise<Listing | undefined>;
  deleteListing(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  private db;

  constructor(databaseUrl: string) {
    const pool = new Pool({ connectionString: databaseUrl });
    this.db = drizzle(pool);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return await this.db.select().from(users);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const result = await this.db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }

  // Listing methods
  async getListing(id: string): Promise<Listing | undefined> {
    const result = await this.db.select().from(listings).where(eq(listings.id, id)).limit(1);
    return result[0];
  }

  async getAllListings(): Promise<Listing[]> {
    return await this.db.select().from(listings);
  }

  async createListing(insertListing: InsertListing): Promise<Listing> {
    const result = await this.db.insert(listings).values(insertListing).returning();
    return result[0];
  }

  async updateListing(id: string, updates: Partial<Listing>): Promise<Listing | undefined> {
    const result = await this.db.update(listings).set({ ...updates, updatedAt: new Date() }).where(eq(listings.id, id)).returning();
    return result[0];
  }

  async deleteListing(id: string): Promise<boolean> {
    const result = await this.db.delete(listings).where(eq(listings.id, id)).returning();
    return result.length > 0;
  }
}

// Initialize storage
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

export const storage = new DatabaseStorage(process.env.DATABASE_URL);

// Seed initial data for testing (only runs once when tables are empty)
(async () => {
  try {
    const existingUsers = await storage.getAllUsers();
    if (existingUsers.length === 0) {
      await storage.createUser({
        username: "admin",
        email: "admin@28house.com",
        password: "password123",
        role: "ADMIN"
      });
      
      await storage.createUser({
        username: "member1",
        email: "member@28house.com",
        password: "password123",
        role: "MEMBER"
      });
      
      console.log("Seeded initial users");
    }
  } catch (error) {
    console.error("Error seeding data:", error);
  }
})();
