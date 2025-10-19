/**
 * Test setup and configuration
 * Runs before all tests
 */

// Set test environment
process.env.NODE_ENV = "test";
process.env.PORT = "3001";
process.env.LOG_LEVEL = "silent";
process.env.LOG_PRETTY = "false";

// Database configuration for tests
// Use a separate test database or schema
process.env.DATABASE_URL =
	process.env.DATABASE_URL ||
	"postgresql://postgres:postgres@localhost:5432/test_db?schema=public";
process.env.DIRECT_URL =
	process.env.DIRECT_URL ||
	"postgresql://postgres:postgres@localhost:5432/test_db?schema=public";

// Mock console methods to reduce noise in tests
global.console = {
	...console,
	log: jest.fn(),
	debug: jest.fn(),
	info: jest.fn(),
	warn: jest.fn(),
	error: jest.fn(),
};

// Increase timeout for integration tests (especially for database operations)
jest.setTimeout(30000);
