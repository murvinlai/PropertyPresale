import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertListingSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users", async (_req, res) => {
    const users = await storage.getAllUsers();
    res.json(users);
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    const user = await storage.updateUser(req.params.id, req.body);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  });

  app.delete("/api/users/:id", async (req, res) => {
    const deleted = await storage.deleteUser(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ success: true });
  });

  // Listing routes
  app.get("/api/listings", async (_req, res) => {
    const listings = await storage.getAllListings();
    res.json(listings);
  });

  app.get("/api/listings/:id", async (req, res) => {
    const listing = await storage.getListing(req.params.id);
    if (!listing) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }
    res.json(listing);
  });

  app.post("/api/listings", async (req, res) => {
    try {
      const listingData = insertListingSchema.parse(req.body);
      const listing = await storage.createListing(listingData);
      res.json(listing);
    } catch (error: any) {
      if (error.errors && Array.isArray(error.errors)) {
        // Zod validation error
        const fieldErrors = error.errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }));
        res.status(400).json({ 
          error: "Validation failed",
          severity: "USER_INPUT_ERROR",
          details: fieldErrors,
          userMessage: `Please check the following fields: ${fieldErrors.map((e: any) => e.field).join(', ')}`
        });
      } else {
        res.status(400).json({ 
          error: "Invalid listing data",
          severity: "USER_INPUT_ERROR",
          userMessage: "Please check all required fields are filled in correctly"
        });
      }
    }
  });

  app.put("/api/listings/:id", async (req, res) => {
    try {
      const listing = await storage.updateListing(req.params.id, req.body);
      if (!listing) {
        res.status(404).json({ 
          error: "Listing not found",
          severity: "ERROR",
          userMessage: "The listing you're trying to update doesn't exist"
        });
        return;
      }
      res.json(listing);
    } catch (error: any) {
      if (error.errors && Array.isArray(error.errors)) {
        const fieldErrors = error.errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }));
        res.status(400).json({ 
          error: "Validation failed",
          severity: "USER_INPUT_ERROR",
          details: fieldErrors,
          userMessage: `Please check the following fields: ${fieldErrors.map((e: any) => e.field).join(', ')}`
        });
      } else {
        res.status(400).json({ 
          error: "Invalid listing data",
          severity: "USER_INPUT_ERROR",
          userMessage: "Please check all required fields are filled in correctly"
        });
      }
    }
  });

  app.delete("/api/listings/:id", async (req, res) => {
    const deleted = await storage.deleteListing(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }
    res.json({ success: true });
  });

  const httpServer = createServer(app);
  return httpServer;
}