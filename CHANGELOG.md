# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-18

### Added
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

### Security
- Helmet for security headers
- CORS with configurable origins
- Rate limiting to prevent abuse
- Input validation with Zod
- Non-root Docker user
- Environment variable validation

### Developer Experience
- Hot reload in development
- Pretty logging in development
- Comprehensive documentation
- Example routes and tests
- Clear project structure
- Type-safe configuration

