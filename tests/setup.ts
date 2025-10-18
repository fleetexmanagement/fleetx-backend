/**
 * Test setup and configuration
 * Runs before all tests
 */

// Set test environment
process.env.NODE_ENV = "test";
process.env.PORT = "3001";
process.env.LOG_LEVEL = "silent";
process.env.LOG_PRETTY = "false";

// Mock console methods to reduce noise in tests
global.console = {
	...console,
	log: jest.fn(),
	debug: jest.fn(),
	info: jest.fn(),
	warn: jest.fn(),
	error: jest.fn(),
};

// Increase timeout for integration tests
jest.setTimeout(10000);
