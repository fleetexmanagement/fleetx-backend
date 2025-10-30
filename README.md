# Backend Express Starter Template 🚀

A **production-ready**, **modern**, and **secure** Express.js backend starter template built with TypeScript and Bun. This template follows industry best practices and includes everything you need to kickstart your next API project.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.1-green)](https://expressjs.com/)
[![Bun](https://img.shields.io/badge/Bun-1.1+-black)](https://bun.sh/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## ✨ Features

### Core Features
- ⚡ **Bun Runtime** - Lightning-fast JavaScript runtime
- 🔷 **TypeScript** - Full type safety with strict mode
- 🚀 **Express 5** - Latest version of Express.js
- 📝 **Auto-generated API Docs** - Swagger/OpenAPI 3.0
- ✅ **Request Validation** - Zod schema validation
- 🔄 **API Versioning** - Built-in versioning support (v1, v2, etc.)

### Production-Ready
- 🛡️ **Security Hardened** - Helmet, CORS, rate limiting
- 📊 **Structured Logging** - Pino with pretty printing in dev
- 🔍 **Request Tracing** - Correlation IDs for debugging
- ⚡ **Performance** - Response compression, caching headers
- 🏥 **Health Checks** - Detailed health endpoints for monitoring
- 🐳 **Docker Ready** - Optimized multi-stage Dockerfile

### Developer Experience
- 🧪 **Comprehensive Tests** - Jest with unit & integration tests
- 🎨 **Code Quality** - Biome for linting and formatting
- 🔄 **Hot Reload** - Fast development with watch mode
- 📦 **Path Aliases** - Clean imports with @ aliases
- 🪝 **Git Hooks** - Husky + lint-staged
- 📚 **Well Documented** - Extensive inline documentation

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Docker](#-docker)
- [Scripts](#-scripts)
- [Best Practices](#-best-practices)
- [Contributing](#-contributing)

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0.0 (or Node.js >= 20.0.0)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd backend-express
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```

4. **Start development server**
   ```bash
   bun run dev
   ```

5. **Access the application**
   - API: http://localhost:3001
   - Health Check: http://localhost:3001/health
   - API Docs: http://localhost:3001/api-docs
   - API Endpoint: http://localhost:3001/api/v1

## 💻 Development Workflow

### Making Commits (Automated)
Instead of `git commit`, use our automated commit tool:
```bash
git add .
bun run commit
```
This will guide you through creating a proper commit message automatically!

### Creating Releases (Automated)
```bash
# Patch release (1.0.0 → 1.0.1) - Bug fixes
bun run release:patch

# Minor release (1.0.0 → 1.1.0) - New features
bun run release:minor

# Major release (1.0.0 → 2.0.0) - Breaking changes
bun run release:major
```
This automatically updates version, changelog, and creates git tags!

### Daily Development
```bash
# Start dev server
bun run dev

# Run tests
bun test

# Check code quality
bun run lint
bun run type-check

# Commit changes (interactive)
bun run commit
```

## 📁 Project Structure

```
backend-express/
├── src/
│   ├── app/
│   │   ├── routes/          # Route definitions
│   │   │   ├── v1/          # API version 1
│   │   │   │   ├── schemas/ # Zod validation schemas
│   │   │   │   ├── items.routes.ts
│   │   │   │   └── index.ts
│   │   │   ├── health.routes.ts
│   │   │   └── index.ts
│   │   ├── server.ts        # Express app setup
│   │   └── swagger.ts       # OpenAPI configuration
│   ├── controllers/         # Route controllers
│   │   ├── health.controller.ts
│   │   ├── example.controller.ts
│   │   └── index.ts
│   ├── core/                # Core utilities
│   │   ├── config.ts        # Environment configuration
│   │   ├── logger.ts        # Pino logger setup
│   │   ├── errors.ts        # Custom error classes
│   │   ├── response.ts      # Response helpers
│   │   └── index.ts
│   ├── middleware/          # Express middleware
│   │   ├── error-handler.ts # Global error handler
│   │   ├── correlation-id.ts# Request tracing
│   │   ├── validator.ts     # Zod validation
│   │   ├── rate-limiter.ts  # Rate limiting
│   │   ├── security.ts      # Security headers
│   │   ├── not-found.ts     # 404 handler
│   │   ├── request-logger.ts# HTTP logging
│   │   └── index.ts
│   ├── types/               # TypeScript types
│   │   ├── api.ts           # API response types
│   │   ├── environment.ts   # Environment variables
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   ├── system-metrics.ts# System monitoring
│   │   ├── health-checker.ts# Health check logic
│   │   └── index.ts
│   └── services/            # Business logic (empty - for your code)
├── tests/
│   ├── unit/                # Unit tests
│   ├── integration/         # Integration tests
│   └── setup.ts             # Test configuration
├── .dockerignore
├── .gitignore
├── babel.config.ts
├── biome.json              # Code formatting config
├── Dockerfile              # Production Docker image
├── env.example             # Environment variables template
├── jest.config.js          # Jest configuration
├── package.json
├── README.md
└── tsconfig.json           # TypeScript configuration
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Application
NODE_ENV=development
PORT=3001
APP_NAME=backend-express
API_VERSION=v1

# CORS Configuration
CORS_ORIGIN=http://localhost:3001,http://localhost:5173
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000      # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100      # Max 100 requests per window

# Logging
LOG_LEVEL=info                   # fatal, error, warn, info, debug, trace
LOG_PRETTY=true                  # Pretty print logs in development

# Security
HELMET_ENABLED=true
TRUST_PROXY=false                # Set to true if behind a proxy/load balancer

# Health Check
HEALTH_CHECK_PATH=/health
METRICS_ENABLED=true
```

## 📚 API Documentation

### Swagger UI

Interactive API documentation is automatically generated and available at:

```
http://localhost:3001/api-docs
```

### OpenAPI Spec

Access the raw OpenAPI specification:

```
http://localhost:3001/api-docs.json
```

### Health Check Endpoints

| Endpoint | Description | Use Case |
|----------|-------------|----------|
| `GET /health` | Basic health check | Load balancers, uptime monitoring |
| `GET /health/detailed` | Detailed health with metrics | Monitoring dashboards |
| `GET /health/ready` | Readiness probe | Kubernetes readiness |
| `GET /health/live` | Liveness probe | Kubernetes liveness |

### Example API Endpoints

All API endpoints are versioned under `/api/v1`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/items` | Get all items (paginated) |
| `GET` | `/api/v1/items/:id` | Get item by ID |
| `POST` | `/api/v1/items` | Create new item |
| `PUT` | `/api/v1/items/:id` | Update item |
| `DELETE` | `/api/v1/items/:id` | Delete item |

## 🧪 Testing

### Run all tests
```bash
bun test
```

### Watch mode
```bash
bun run test:watch
```

### Coverage report
```bash
bun run test:coverage
```

### Test Structure

- **Unit Tests** - Test individual functions and utilities
- **Integration Tests** - Test API endpoints end-to-end

Example test:
```typescript
import request from 'supertest';
import { createApp } from '../src/app/server';

describe('GET /health', () => {
  it('should return health status', async () => {
    const app = createApp();
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('healthy');
  });
});
```

## 🐳 Docker

### Build Docker image
```bash
bun run docker:build
```

or manually:
```bash
docker build -t backend-express .
```

### Run container
```bash
bun run docker:run
```

or manually:
```bash
docker run -p 3001:3001 --env-file .env backend-express
```

### Docker Features
- ✅ Multi-stage build for smaller image size
- ✅ Non-root user for security
- ✅ Health check included
- ✅ Proper signal handling with dumb-init
- ✅ Production optimized

## 📜 Scripts

### Development
| Script | Description |
|--------|-------------|
| `bun run dev` | Start development server with hot reload |
| `bun run start` | Start production server |
| `bun run build` | Build for production |

### Testing
| Script | Description |
|--------|-------------|
| `bun test` | Run tests |
| `bun run test:watch` | Run tests in watch mode |
| `bun run test:coverage` | Generate coverage report |

### Code Quality
| Script | Description |
|--------|-------------|
| `bun run lint` | Check code with Biome |
| `bun run lint:fix` | Fix linting issues |
| `bun run format` | Format code with Biome |
| `bun run type-check` | Check TypeScript types |

### Database (Prisma)
| Script | Description |
|--------|-------------|
| `bun run db:generate` | Generate Prisma client |
| `bun run db:migrate` | Run database migrations |
| `bun run db:studio` | Open Prisma Studio |

### Git & Versioning (Automated)
| Script | Description |
|--------|-------------|
| `bun run commit` | Interactive commit (Commitizen) |
| `bun run release` | Auto-generate release and changelog |
| `bun run release:patch` | Patch version (1.0.0 → 1.0.1) |
| `bun run release:minor` | Minor version (1.0.0 → 1.1.0) |
| `bun run release:major` | Major version (1.0.0 → 2.0.0) |

### Docker
| Script | Description |
|--------|-------------|
| `bun run docker:build` | Build Docker image |
| `bun run docker:run` | Run Docker container |

## 🎯 Best Practices

### Error Handling

Use custom error classes for consistent error handling:

```typescript
import { NotFoundError, BadRequestError } from '@core/errors';

// In your controller
if (!user) {
  throw new NotFoundError('User not found', { userId });
}
```

### Request Validation

Always validate request data with Zod:

```typescript
import { z } from 'zod';
import { validateBody } from '@middleware/validator';

const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
});

router.post('/', validateBody(createUserSchema), controller.createUser);
```

### Response Format

Use standardized response helpers:

```typescript
import { success, created, error } from '@core/response';

// Success response
return success(res, data, 'Operation successful');

// Created response (201)
return created(res, newItem, 'Item created');

// Paginated response
return paginated(res, items, page, limit, total);
```

### Logging

Use structured logging with context:

```typescript
import { log } from '@core/logger';

log.info('User created', { userId, email });
log.error('Failed to create user', error, { userId });
```

### Async Operations

Wrap async route handlers with asyncHandler:

```typescript
import { asyncHandler } from '@middleware/error-handler';

router.get('/', asyncHandler(async (req, res) => {
  const data = await fetchData();
  return success(res, data);
}));
```

## 🔐 Security Features

- **Helmet** - Security headers (XSS protection, CSP, etc.)
- **CORS** - Configurable CORS with credentials support
- **Rate Limiting** - Prevent DDoS and brute force attacks
- **Request Validation** - Zod schema validation
- **Error Sanitization** - No stack traces in production
- **Correlation IDs** - Request tracing for debugging

## 🚀 Production Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure production environment variables
3. Set `LOG_PRETTY=false` for structured JSON logs
4. Enable `TRUST_PROXY=true` if behind load balancer
5. Update `CORS_ORIGIN` with your domain

### Docker Deployment

```bash
# Build production image
docker build -t backend-express:latest .

# Run with production env
docker run -d \
  -p 3001:3001 \
  --env-file .env.production \
  --name backend-api \
  backend-express:latest
```

### Health Checks

Configure your load balancer to use:
- **Liveness**: `GET /health/live` (app is running)
- **Readiness**: `GET /health/ready` (app is ready to serve traffic)

## 📝 Adding New Features

### Adding a New Route

1. **Create schema** in `src/app/routes/v1/schemas/`
2. **Create controller** in `src/controllers/`
3. **Create route file** in `src/app/routes/v1/`
4. **Add to router** in `src/app/routes/v1/index.ts`
5. **Add tests** in `tests/integration/`

### Adding a New Service

1. **Create service** in `src/services/`
2. **Add types** in `src/types/` if needed
3. **Use in controller**
4. **Add tests** in `tests/unit/services/`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with:
- [Express.js](https://expressjs.com/) - Fast, unopinionated web framework
- [Bun](https://bun.sh/) - Fast all-in-one JavaScript runtime
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- [Zod](https://zod.dev/) - TypeScript-first schema validation
- [Pino](https://getpino.io/) - Super fast, all natural JSON logger
- [Helmet](https://helmetjs.github.io/) - Secure Express apps
- [Swagger](https://swagger.io/) - API documentation

---

**Happy Coding! 🚀**

If you found this template helpful, please consider giving it a ⭐ star on GitHub!

