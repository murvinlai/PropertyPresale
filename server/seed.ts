import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
    const username = "xukaadmin";
    const email = "business@almondtreemedia.ca";
    const password = "Xuka12miko..";
    const role = "SUPERADMIN";

    console.log("Seeding initial superadmin...");

    try {
        // Check if user already exists
        const [existing] = await db.select().from(users).where(eq(users.username, username));
        if (existing) {
            console.log(`User ${username} already exists. Skipping.`);
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.insert(users).values({
            username,
            email,
            password: hashedPassword,
            role: role as any,
            isActive: true,
            creditsBalance: 0,
        });

        console.log("Superadmin created successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding superadmin:", err);
        process.exit(1);
    }
}

seed();
