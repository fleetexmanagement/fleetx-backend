import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = global as unknown as {
	db: PrismaClient;
};

const db = globalForPrisma.db || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.db = db;

export default db as PrismaClient;
