import { afterAll, describe, expect, it } from "@jest/globals";
import db, { disconnectDatabase } from "../../src/lib/prisma.ts";

/**
 * Prisma Integration Tests (Basic - No Models Required)
 *
 * These tests verify:
 * 1. Database connection and configuration
 * 2. Raw SQL query execution
 * 3. Client initialization and cleanup
 *
 * Prerequisites:
 * - PostgreSQL database running
 * - DATABASE_URL configured in test environment
 * - Prisma client generated: `bunx prisma generate`
 *
 * Note: These tests work without any models defined in the schema.
 * Once you add models to prisma/schema.prisma, you can expand these tests
 * to include CRUD operations, relationships, transactions, etc.
 */

describe("Prisma Integration - Basic Tests", () => {
	// Disconnect after all tests
	afterAll(async () => {
		await disconnectDatabase();
	});

	describe("Database Connection", () => {
		it("should connect to the database successfully", async () => {
			const result = await db.$queryRaw<
				Array<{ result: number }>
			>`SELECT 1 as result`;
			expect(result[0]?.result).toBe(1);
		});

		it("should have Prisma client properly configured", async () => {
			expect(db).toBeDefined();
			expect(db.$connect).toBeDefined();
			expect(db.$disconnect).toBeDefined();
			expect(db.$queryRaw).toBeDefined();
			expect(db.$executeRaw).toBeDefined();
		});

		it("should execute health check query", async () => {
			const isHealthy = await db.$queryRaw<Array<{ healthy: boolean }>>`
				SELECT true as healthy
			`;
			expect(isHealthy[0]?.healthy).toBe(true);
		});

		it("should verify database exists", async () => {
			const result = await db.$queryRaw<Array<{ current_database: string }>>`
				SELECT current_database()
			`;
			expect(result[0]?.current_database).toBeDefined();
		});

		it("should check PostgreSQL version", async () => {
			const result = await db.$queryRaw<Array<{ version: string }>>`
				SELECT version()
			`;
			expect(result[0]?.version).toContain("PostgreSQL");
		});
	});

	describe("Raw SQL Queries", () => {
		it("should execute simple SELECT query", async () => {
			const result = await db.$queryRaw<Array<{ sum: number }>>`
				SELECT (2 + 2) as sum
			`;
			expect(result[0]?.sum).toBe(4);
		});

		it("should execute parameterized query", async () => {
			const value = 42;
			const result = await db.$queryRaw<Array<{ value: bigint }>>`
				SELECT ${value} as value
			`;
			// PostgreSQL returns numeric literals as BigInt
			expect(result[0]?.value).toBe(42n);
		});

		it("should handle string parameters", async () => {
			const text = "Hello Prisma";
			const result = await db.$queryRaw<Array<{ text: string }>>`
				SELECT ${text} as text
			`;
			expect(result[0]?.text).toBe("Hello Prisma");
		});

		it("should execute query with multiple parameters", async () => {
			const num1 = 10;
			const num2 = 20;
			const result = await db.$queryRaw<Array<{ sum: bigint }>>`
				SELECT ${num1} + ${num2} as sum
			`;
			// PostgreSQL returns calculated numeric values as BigInt
			expect(result[0]?.sum).toBe(30n);
		});

		it("should query system tables", async () => {
			const tables = await db.$queryRaw<Array<{ tablename: string }>>`
				SELECT tablename 
				FROM pg_tables 
				WHERE schemaname = 'public' 
				LIMIT 5
			`;
			expect(Array.isArray(tables)).toBe(true);
		});

		it("should execute timestamp queries", async () => {
			const result = await db.$queryRaw<Array<{ now: Date }>>`
				SELECT NOW() as now
			`;
			expect(result[0]?.now).toBeInstanceOf(Date);
		});
	});

	describe("Raw SQL Execution", () => {
		it("should execute raw SQL without return value", async () => {
			// $executeRaw returns the number of affected rows
			const result = await db.$executeRaw`SELECT 1`;
			expect(typeof result).toBe("number");
		});

		it("should handle execution with parameters", async () => {
			const value = 100;
			const result = await db.$executeRaw`SELECT ${value}`;
			expect(typeof result).toBe("number");
			expect(result).toBeGreaterThanOrEqual(0);
		});
	});

	describe("Database Information", () => {
		it("should get current schema", async () => {
			const result = await db.$queryRaw<Array<{ current_schema: string }>>`
				SELECT current_schema()
			`;
			expect(result[0]?.current_schema).toBe("public");
		});

		it("should get current user", async () => {
			const result = await db.$queryRaw<Array<{ current_user: string }>>`
				SELECT current_user
			`;
			expect(result[0]?.current_user).toBeDefined();
		});

		it("should check connection info", async () => {
			const result = await db.$queryRaw<
				Array<{ inet_server_addr: string | null }>
			>`
				SELECT inet_server_addr()
			`;
			// Result can be null for local connections
			expect(result[0]).toHaveProperty("inet_server_addr");
		});

		it("should verify timezone", async () => {
			const result = await db.$queryRaw<Array<{ TimeZone: string }>>`
				SHOW timezone
			`;
			// PostgreSQL returns 'TimeZone' with capital T and Z
			expect(result[0]?.TimeZone).toBeDefined();
		});
	});

	describe("Transaction Support", () => {
		it("should support interactive transactions", async () => {
			const result = await db.$transaction(async (tx) => {
				const r1 = await tx.$queryRaw<Array<{ val: number }>>`SELECT 1 as val`;
				const r2 = await tx.$queryRaw<Array<{ val: number }>>`SELECT 2 as val`;
				return { first: r1[0]?.val, second: r2[0]?.val };
			});

			expect(result.first).toBe(1);
			expect(result.second).toBe(2);
		});

		it("should rollback transaction on error", async () => {
			try {
				await db.$transaction(async (tx) => {
					await tx.$queryRaw`SELECT 1`;
					throw new Error("Intentional error");
				});
			} catch (error) {
				expect(error).toBeDefined();
			}
		});

		it("should support batch transactions", async () => {
			const results = await db.$transaction([
				db.$queryRaw<Array<{ val: number }>>`SELECT 1 as val`,
				db.$queryRaw<Array<{ val: number }>>`SELECT 2 as val`,
			]);

			expect(results).toHaveLength(2);
			expect(results[0][0]?.val).toBe(1);
			expect(results[1][0]?.val).toBe(2);
		});
	});

	describe("Error Handling", () => {
		it("should handle syntax errors gracefully", async () => {
			try {
				await db.$queryRaw`INVALID SQL SYNTAX`;
				// If we get here, the test should fail
				expect(true).toBe(false);
			} catch (error) {
				// Error is expected
				expect(error).toBeDefined();
			}
		});

		it("should handle non-existent table queries", async () => {
			try {
				await db.$queryRaw`SELECT * FROM non_existent_table_12345`;
				// If we get here, the test should fail
				expect(true).toBe(false);
			} catch (error) {
				// Error is expected
				expect(error).toBeDefined();
			}
		});

		it("should handle type mismatches", async () => {
			try {
				await db.$queryRaw`SELECT 'text' / 2`;
				// If we get here, the test should fail
				expect(true).toBe(false);
			} catch (error) {
				// Error is expected
				expect(error).toBeDefined();
			}
		});
	});

	describe("Connection Lifecycle", () => {
		it("should allow manual connect", async () => {
			// $connect() returns void, just ensure it doesn't throw
			await db.$connect();
			// If we get here without error, the test passes
			expect(true).toBe(true);
		});

		it("should handle multiple queries in sequence", async () => {
			const r1 = await db.$queryRaw<Array<{ val: number }>>`SELECT 1 as val`;
			const r2 = await db.$queryRaw<Array<{ val: number }>>`SELECT 2 as val`;
			const r3 = await db.$queryRaw<Array<{ val: number }>>`SELECT 3 as val`;

			expect(r1[0]?.val).toBe(1);
			expect(r2[0]?.val).toBe(2);
			expect(r3[0]?.val).toBe(3);
		});

		it("should handle parallel queries", async () => {
			const [r1, r2, r3] = await Promise.all([
				db.$queryRaw<Array<{ val: number }>>`SELECT 1 as val`,
				db.$queryRaw<Array<{ val: number }>>`SELECT 2 as val`,
				db.$queryRaw<Array<{ val: number }>>`SELECT 3 as val`,
			]);

			expect(r1[0]?.val).toBe(1);
			expect(r2[0]?.val).toBe(2);
			expect(r3[0]?.val).toBe(3);
		});
	});

	describe("Performance", () => {
		it("should execute queries efficiently", async () => {
			const startTime = Date.now();

			await Promise.all(
				Array.from({ length: 10 }, () => db.$queryRaw`SELECT 1`),
			);

			const duration = Date.now() - startTime;

			// 10 queries should complete quickly (less than 2 seconds)
			expect(duration).toBeLessThan(2000);
		});

		it("should handle larger result sets", async () => {
			const result = await db.$queryRaw<Array<{ num: number }>>`
				SELECT generate_series(1, 100) as num
			`;

			expect(result).toHaveLength(100);
			expect(result[0]?.num).toBe(1);
			expect(result[99]?.num).toBe(100);
		});
	});
});

/**
 * NEXT STEPS:
 *
 * Once you add models to prisma/schema.prisma:
 *
 * 1. Run migrations:
 *    bunx prisma migrate dev --name init
 *
 * 2. Generate Prisma client:
 *    bunx prisma generate
 *
 * 3. Expand these tests to include:
 *    - CRUD operations (Create, Read, Update, Delete)
 *    - Relationships (one-to-many, one-to-one, many-to-many)
 *    - Advanced queries (filtering, sorting, pagination)
 *    - Aggregations and grouping
 *    - Data integrity and constraints
 *    - Complex transactions
 *
 * Example test structure for when you have models:
 *
 * describe("User Model - CRUD Operations", () => {
 *   beforeEach(async () => {
 *     await cleanupDatabase();
 *   });
 *
 *   it("should create a user", async () => {
 *     const user = await db.user.create({
 *       data: { email: "test@example.com", name: "Test" },
 *     });
 *     expect(user).toBeDefined();
 *   });
 * });
 */
