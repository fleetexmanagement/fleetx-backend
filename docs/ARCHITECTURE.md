# Architecture Overview

This document provides a high-level overview of the application architecture.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Load Balancer                         │
│                    (NGINX, ALB, etc.)                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express Application                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Middleware Stack                         │   │
│  │  • Security (Helmet, CORS)                           │   │
│  │  • Correlation ID                                    │   │
│  │  • Request Logging                                   │   │
│  │  • Rate Limiting                                     │   │
│  │  • Body Parsing                                      │   │
│  │  • Compression                                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                     │                                        │
│  ┌──────────────────▼──────────────────────────────────┐   │
│  │              API Routes (Versioned)                  │   │
│  │  • /health/*                                         │   │
│  │  • /api/v1/*                                         │   │
│  │  • /api-docs                                         │   │
│  └──────────────────┬──────────────────────────────────┘   │
│                     │                                        │
│  ┌──────────────────▼──────────────────────────────────┐   │
│  │           Validation Layer (Zod)                     │   │
│  └──────────────────┬──────────────────────────────────┘   │
│                     │                                        │
│  ┌──────────────────▼──────────────────────────────────┐   │
│  │              Controllers                             │   │
│  │  • Business Logic Orchestration                      │   │
│  │  • Request/Response Handling                         │   │
│  └──────────────────┬──────────────────────────────────┘   │
│                     │                                        │
│  ┌──────────────────▼──────────────────────────────────┐   │
│  │              Services Layer                          │   │
│  │  • Business Logic Implementation                     │   │
│  │  • External API Calls                                │   │
│  │  • Data Processing                                   │   │
│  └──────────────────┬──────────────────────────────────┘   │
│                     │                                        │
│  ┌──────────────────▼──────────────────────────────────┐   │
│  │           Error Handler                              │   │
│  │  • Global Error Catching                             │   │
│  │  • Standardized Error Responses                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Layer Responsibilities

### 1. Middleware Layer
**Location**: `src/middleware/`

**Responsibilities**:
- Request pre-processing
- Security headers
- Authentication/Authorization (when added)
- Rate limiting
- Logging
- Request validation

**Key Components**:
- `security.ts` - Helmet, CORS, Compression
- `correlation-id.ts` - Request tracing
- `rate-limiter.ts` - DDoS protection
- `validator.ts` - Zod validation
- `error-handler.ts` - Global error handling
- `request-logger.ts` - HTTP request logging

### 2. Routes Layer
**Location**: `src/app/routes/`

**Responsibilities**:
- URL routing
- HTTP method mapping
- Route-level middleware application
- API versioning

**Structure**:
```
routes/
├── health.routes.ts      # Health check endpoints
├── v1/                   # API version 1
│   ├── items.routes.ts
│   ├── schemas/          # Validation schemas
│   └── index.ts
└── index.ts              # Main router
```

### 3. Controllers Layer
**Location**: `src/controllers/`

**Responsibilities**:
- Request handling
- Response formatting
- Business logic orchestration
- Service layer coordination

**Best Practices**:
- Keep controllers thin
- Delegate business logic to services
- Use standard response helpers
- Handle async operations properly

### 4. Services Layer
**Location**: `src/services/`

**Responsibilities**:
- Business logic implementation
- External API interactions
- Data transformations
- Complex operations

**Note**: Currently empty - add your business logic here

### 5. Core Layer
**Location**: `src/core/`

**Responsibilities**:
- Application configuration
- Logging setup
- Error classes
- Response helpers
- Shared utilities

**Components**:
- `config.ts` - Environment configuration
- `logger.ts` - Pino logger
- `errors.ts` - Custom error classes
- `response.ts` - Response helpers

### 6. Types Layer
**Location**: `src/types/`

**Responsibilities**:
- TypeScript type definitions
- Interface declarations
- Schema types

### 7. Utils Layer
**Location**: `src/utils/`

**Responsibilities**:
- Utility functions
- Helper methods
- System metrics
- Health checks

## 🔄 Request Flow

```
1. Request arrives → Middleware Stack
2. Correlation ID assigned
3. Request logged
4. Rate limit checked
5. Security headers added
6. Body parsed
7. Response compressed
8. Router matches path → Route Handler
9. Request validated (Zod)
10. Controller invoked
11. Service called (if needed)
12. Response formatted
13. Response sent
14. Request logged (completion)
```

## 🎯 Design Patterns

### 1. Dependency Injection
Services and utilities are injected where needed, making testing easier.

### 2. Middleware Pattern
Express middleware for cross-cutting concerns (logging, security, etc.).

### 3. Repository Pattern (Optional)
For database operations (add when needed).

### 4. Factory Pattern
Used in error classes and response helpers.

### 5. Singleton Pattern
Configuration and logger instances.

## 🔒 Security Architecture

### Defense in Depth

1. **Network Layer**
   - Rate limiting
   - DDoS protection
   - CORS configuration

2. **Application Layer**
   - Input validation (Zod)
   - Security headers (Helmet)
   - Error sanitization

3. **Data Layer**
   - Type safety (TypeScript)
   - Schema validation
   - Parameter validation

### Security Features

- ✅ Helmet for security headers
- ✅ CORS with configurable origins
- ✅ Rate limiting per IP
- ✅ Request validation
- ✅ Error message sanitization
- ✅ Non-root Docker user
- ✅ Environment variable validation

## 📊 Observability

### Logging
- Structured JSON logging (Pino)
- Correlation IDs for request tracing
- Different log levels per environment
- Pretty printing in development

### Monitoring
- Health check endpoints
- System metrics (CPU, memory)
- Process metrics (uptime, PID)
- Ready/live probes for Kubernetes

### Tracing
- Correlation IDs in all logs
- Request/response logging
- Error tracking with context

## 🔧 Configuration Management

### Environment-based Configuration
```typescript
// src/core/config.ts
export const config = {
  nodeEnv: process.env.NODE_ENV,
  port: Number(process.env.PORT),
  // ... validated with Zod
};
```

### Validation
All environment variables are validated at startup using Zod schemas.

## 🧪 Testing Strategy

### Test Pyramid

```
         ┌─────────┐
         │   E2E   │  (Few)
         └─────────┘
       ┌─────────────┐
       │ Integration │  (Some)
       └─────────────┘
     ┌─────────────────┐
     │  Unit Tests     │  (Many)
     └─────────────────┘
```

### Test Types

1. **Unit Tests**
   - Test individual functions
   - Mock external dependencies
   - Fast execution

2. **Integration Tests**
   - Test API endpoints
   - Test middleware integration
   - Use supertest

3. **E2E Tests** (Add when needed)
   - Test complete user flows
   - Test with real dependencies

## 🚀 Scalability Considerations

### Horizontal Scaling
- Stateless design (no in-memory sessions)
- Ready for load balancing
- Docker containerized

### Performance
- Response compression
- Efficient logging
- Minimal middleware stack
- Async/await throughout

### Future Enhancements
- Add caching layer (Redis)
- Add message queue (RabbitMQ, SQS)
- Add database connection pooling
- Implement circuit breakers
- Add distributed tracing

## 📚 Technology Stack

### Runtime
- **Bun** - Fast JavaScript runtime
- **Node.js** - Compatible (can switch)

### Framework
- **Express 5** - Web framework

### Language
- **TypeScript** - Type-safe JavaScript

### Validation
- **Zod** - Schema validation

### Logging
- **Pino** - Fast JSON logger
- **Pino-HTTP** - HTTP logging

### Security
- **Helmet** - Security headers
- **CORS** - Cross-origin requests
- **express-rate-limit** - Rate limiting

### Documentation
- **Swagger/OpenAPI** - API documentation
- **swagger-jsdoc** - JSDoc to OpenAPI
- **swagger-ui-express** - UI hosting

### Testing
- **Jest** - Test framework
- **Supertest** - HTTP testing
- **ts-jest** - TypeScript support

### Code Quality
- **Biome** - Linting & formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit checks

## 🔄 Development Workflow

```
Code → Lint → Type Check → Test → Commit → Push → CI/CD → Deploy
```

## 📈 Future Roadmap

### Phase 1: Foundation (Complete)
- ✅ Project structure
- ✅ Middleware setup
- ✅ Error handling
- ✅ Logging
- ✅ Validation
- ✅ Documentation
- ✅ Testing

### Phase 2: Enhancement (Optional)
- [ ] Database integration
- [ ] Authentication/Authorization
- [ ] Caching layer
- [ ] Background jobs
- [ ] File uploads
- [ ] Email service

### Phase 3: Advanced (Optional)
- [ ] Microservices architecture
- [ ] Message queues
- [ ] Distributed tracing
- [ ] Advanced monitoring
- [ ] Performance optimization

---

This architecture is designed to be **simple**, **scalable**, and **maintainable**. It follows industry best practices while remaining flexible for future enhancements.

