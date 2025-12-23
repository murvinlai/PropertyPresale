import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { type User as SelectUser } from "@shared/schema";

declare global {
    namespace Express {
        interface User extends SelectUser { }
    }
}

export const ensureAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) return next();
    res.status(401).send("Unauthorized");
};

export const ensureAdmin = (req: any, res: any, next: any) => {
    if (req.isAuthenticated() && (req.user.role === "ADMIN" || req.user.role === "SUPERADMIN")) {
        return next();
    }
    res.status(403).send("Forbidden: Admin access required");
};

export const ensureSuperAdmin = (req: any, res: any, next: any) => {
    if (req.isAuthenticated() && req.user.role === "SUPERADMIN") {
        return next();
    }
    res.status(403).send("Forbidden: Superadmin access required");
};

export function setupAuth(app: Express) {
    const sessionSettings: session.SessionOptions = {
        secret: process.env.SESSION_SECRET || "development-secret",
        resave: false,
        saveUninitialized: false,
        store: storage.sessionStore,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
    };

    if (app.get("env") === "production") {
        app.set("trust proxy", 1);
    }

    app.use(session(sessionSettings));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                const user = await storage.getUserByUsername(username);
                if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
                    return done(null, false, { message: "Invalid username or password" });
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }),
    );

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id: number, done) => {
        try {
            const user = await storage.getUser(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    app.post("/api/register", async (req, res, next) => {
        try {
            const existingUser = await storage.getUserByUsername(req.body.username);
            if (existingUser) {
                return res.status(400).send("Username already exists");
            }
            const existingEmail = await storage.getUserByEmail(req.body.email);
            if (existingEmail) {
                return res.status(400).send("Email already exists");
            }

            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = await storage.createUser({
                ...req.body,
                password: hashedPassword,
                role: "GUEST", // Force GUEST role on public registration
            });

            req.login(user, (err) => {
                if (err) return next(err);
                res.status(201).json(user);
            });
        } catch (err) {
            next(err);
        }
    });

    app.post("/api/login", (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.status(401).send(info?.message || "Login failed");
            req.login(user, (err) => {
                if (err) return next(err);
                res.status(200).json(user);
            });
        })(req, res, next);
    });

    app.post("/api/logout", (req, res, next) => {
        req.logout((err) => {
            if (err) return next(err);
            res.sendStatus(200);
        });
    });

    app.get("/api/user", (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        res.json(req.user);
    });

    // Admin Management Routes (SUPERADMIN Only)
    app.post("/api/admin/promote", ensureSuperAdmin, async (req, res) => {
        const { userId } = req.body;
        try {
            const user = await storage.updateUserRole(userId, "ADMIN");
            res.json(user);
        } catch (e: any) {
            res.status(400).send(e.message);
        }
    });

    app.post("/api/admin/demote", ensureSuperAdmin, async (req, res) => {
        const { userId } = req.body;
        try {
            // Prevent demoting self or other Superadmins via this API? User requirements imply Superadmin cannot be removed by API.
            const targetUser = await storage.getUser(userId);
            if (targetUser?.role === "SUPERADMIN") {
                return res.status(403).send("Cannot demote a Superadmin");
            }
            const user = await storage.updateUserRole(userId, "GUEST"); // Default demotion to GUEST
            res.json(user);
        } catch (e: any) {
            res.status(400).send(e.message);
        }
    });

    app.post("/api/admin/deactivate", ensureSuperAdmin, async (req, res) => {
        const { userId } = req.body;
        try {
            const targetUser = await storage.getUser(userId);
            if (targetUser?.role === "SUPERADMIN") {
                return res.status(403).send("Cannot deactivate a Superadmin");
            }
            const user = await storage.deactivateUser(userId);
            res.json(user);
        } catch (e: any) {
            res.status(400).send(e.message);
        }
    });
}
