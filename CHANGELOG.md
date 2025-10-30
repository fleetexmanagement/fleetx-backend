# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 2.1.0 (2025-01-30)

### ✨ Features

* **auth:** Better Auth integration with comprehensive authentication system
* **auth:** Email/password authentication with email verification
* **auth:** Magic link authentication support
* **auth:** Email OTP (One-Time Password) authentication
* **auth:** Two-factor authentication (2FA) support
* **auth:** Username-based authentication
* **auth:** Organization/multi-tenancy support
* **auth:** Admin plugin for role-based access control
* **auth:** Session management with getSession API
* **middleware:** Added requireSession middleware for route protection
* **middleware:** Added requireAdmin middleware for admin-only routes
* **config:** Environment variable validation for Better Auth configuration
* **config:** Better Auth URL configuration with BETTER_AUTH_URL
* **config:** Secret key configuration with BETTER_AUTH_SECRET
* **routes:** Protected all v1/items routes with authentication

### 🔧 Improvements

* **auth:** Fixed Better Auth baseURL configuration to use backend URL
* **auth:** Mounted Better Auth handler before body parsers to avoid parsing issues
* **auth:** Removed duplicate auth handler mounting from v1 router
* **security:** Updated CORS configuration with explicit origins for credential support
* **security:** Added proper environment variable validation for auth and database
* **routes:** All CRUD operations now require valid session

### 📚 Documentation

* Updated environment variable requirements
* Added authentication flow documentation
* Updated deployment guide with auth configuration
* Enhanced API guidelines with authentication examples

## 2.0.0 (2025-10-30)


### ⚠ BREAKING CHANGES

* **prisma_intigration&db_setup:** Added the database with prisma orm.
* Team must now use 'bun run commit' instead of 'git commit'

This implements a fully automated Git workflow focusing on:
- Automated commit messages
- Automated changelog generation
- Automated versioning
- Simple and easy team workflow
- Professional industry standards

* complete git and vcs management system cleanup ([0b17426](https://github.com/fleetexmanagement/fleetx-backend/commit/0b17426b3866b3285bd3a147b1b8638ef1b8a836))


### ✨ Features

* added prisma_orm ([b7998a4](https://github.com/fleetexmanagement/fleetx-backend/commit/b7998a4ffeb78d9a86b5484c42fe1804f93fac18))
* **prisma_intigration&db_setup:** setup prisma orm, connect with supabase, write test for prisma ([7881ccf](https://github.com/fleetexmanagement/fleetx-backend/commit/7881ccf1aa84164d6065be504b87dace973abb77))

## [1.0.0] - 2025-01-18

### ✨ Added
- Initial release of production-ready Express.js backend starter template
- TypeScript support with strict mode
- Express 5 with modern middleware
- Comprehensive security setup (Helmet, CORS, Rate Limiting)
- Structured logging with Pino
- Request correlation IDs for tracing
- Auto-generated API documentation with Swagger/OpenAPI
- Request validation using Zod schemas
- API versioning (v1)
- Detailed health check endpoints
- System metrics monitoring
- Comprehensive test suite (Jest)
- Docker support with optimized Dockerfile
- Git hooks with Husky
- Code formatting and linting with Biome
- Graceful shutdown handling
- Error handling middleware
- Example CRUD endpoints
- Path aliases for clean imports
- Production-ready configuration
- Prisma ORM integration

### 🔒 Security
- Helmet for security headers
- CORS with configurable origins
- Rate limiting to prevent abuse
- Input validation with Zod
- Non-root Docker user
- Environment variable validation

### 💻 Developer Experience
- Hot reload in development
- Pretty logging in development
- Comprehensive documentation
- Example routes and tests
- Clear project structure
- Type-safe configuration
- Automated commit messages
- Automated changelog generation

[Unreleased]: https://github.com/fleetexmanagement/fleetx-backend/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/fleetexmanagement/fleetx-backend/releases/tag/v1.0.0
