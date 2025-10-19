import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = global as unknown as {
	db: PrismaClient | undefined;
};

/**
 * Prisma Client Singleton
 * - Prevents multiple instances in development/test
 * - Properly handles connection lifecycle
 * - Supports graceful shutdown
 */
const db =
	globalForPrisma.db ||
	new PrismaClient({
		log:
			process.env.NODE_ENV === "development"
				? ["query", "error", "warn"]
				: ["error"],
	});

// Cache instance in development/test to prevent hot-reload issues
if (process.env.NODE_ENV !== "production") {
	globalForPrisma.db = db;
}

/**
 * Graceful disconnect on process termination
 */
process.on("beforeExit", async () => {
	await db.$disconnect();
});

export async function disconnectDatabase(): Promise<void> {
	await db.$disconnect();
}

export default db as PrismaClient;
