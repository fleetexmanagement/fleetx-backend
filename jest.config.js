/** @type {import('jest').Config} */
export default {
	preset: "ts-jest",
	testEnvironment: "node",
	roots: ["<rootDir>/tests"],
	setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
	testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
	collectCoverageFrom: [
		"src/**/*.{ts,tsx}",
		"!src/**/*.d.ts",
		"!src/**/__tests__/**",
		"!src/**/index.ts",
	],
	coverageThreshold: {
		global: {
			branches: 70,
			functions: 70,
			lines: 70,
			statements: 70,
		},
	},
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
		"^@app/(.*)$": "<rootDir>/src/app/$1",
		"^@core/(.*)$": "<rootDir>/src/core/$1",
		"^@middleware/(.*)$": "<rootDir>/src/middleware/$1",
		"^@utils/(.*)$": "<rootDir>/src/utils/$1",
		"^@types/(.*)$": "<rootDir>/src/types/$1",
		"^@controllers/(.*)$": "<rootDir>/src/controllers/$1",
		"^@services/(.*)$": "<rootDir>/src/services/$1",
	},
	transform: {
		"^.+\\.ts$": [
			"ts-jest",
			{
				useESM: true,
			},
		],
	},
	extensionsToTreatAsEsm: [".ts"],
	globals: {
		"ts-jest": {
			useESM: true,
		},
	},
};
