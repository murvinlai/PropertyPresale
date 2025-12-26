import "dotenv/config";
import { storage } from "../server/storage";
import bcrypt from "bcryptjs";

async function seedSuperAdmin() {
    console.log("Seeding SuperAdmin...");

    const username = "xukaadmin";
    const email = "business@almondtreemedia.ca";
    const password = "Xuka12miko..";
    const role = "SUPERADMIN";

    const existingUser = await storage.getUserByUsername(username);
    if (existingUser) {
        console.log("SuperAdmin user already exists.");
        if (existingUser.role !== "SUPERADMIN") {
            console.log("Updating existing user to SUPERADMIN...");
            await storage.updateUserRole(existingUser.id, "SUPERADMIN");
        }
        process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await storage.createUser({
        username,
        email,
        password: hashedPassword,
        role
    });

    console.log("SuperAdmin user created successfully!");
    process.exit(0);
}

seedSuperAdmin().catch((err) => {
    console.error("Failed to seed SuperAdmin:", err);
    process.exit(1);
});
