# API Development Guidelines

This document outlines the standards and best practices for developing APIs in this project.

## 📋 Table of Contents
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Authentication](#authentication)
- [Validation](#validation)
- [Versioning](#versioning)
- [Naming Conventions](#naming-conventions)
- [Security](#security)

## 📦 Response Format

All API responses follow a standardized format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* response data */ },
  "timestamp": "2025-01-18T12:00:00.000Z",
  "path": "/api/v1/items",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "details": { /* additional error details */ }
  },
  "timestamp": "2025-01-18T12:00:00.000Z",
  "path": "/api/v1/items/123",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2025-01-18T12:00:00.000Z",
  "path": "/api/v1/items",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## ⚠️ Error Handling

### Standard Error Codes

| HTTP Status | Error Code | Description |
|------------|------------|-------------|
| 400 | BAD_REQUEST | Invalid request format or parameters |
| 401 | UNAUTHORIZED | Authentication required |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Resource conflict (e.g., duplicate) |
| 422 | VALIDATION_ERROR | Request validation failed |
| 429 | TOO_MANY_REQUESTS | Rate limit exceeded |
| 500 | INTERNAL_ERROR | Internal server error |
| 503 | SERVICE_UNAVAILABLE | Service temporarily unavailable |

### Using Error Classes

```typescript
import { NotFoundError, BadRequestError, ValidationError } from '@core/errors';

// In your controller
if (!user) {
  throw new NotFoundError('User not found', { userId });
}

if (!isValid) {
  throw new BadRequestError('Invalid input', { field: 'email' });
}
```

## 🔐 Authentication

This API uses [Better Auth](https://www.better-auth.com/) for authentication and authorization.

### Authentication Endpoints

Better Auth provides authentication endpoints at `/api/auth/*`:
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login
- `POST /api/auth/sign-out` - User logout
- `GET /api/auth/session` - Get current session
- And many more (password reset, email verification, etc.)

### Protected Routes

Use the `requireSession` middleware to protect routes:

```typescript
import { Router } from "express";
import { requireSession } from "../../../../middleware/index.ts";

const router = Router();

// All routes require authentication
router.use(requireSession);

router.get("/", controller.getAll);
router.post("/", controller.create);
```

### Role-Based Access Control

Use the `requireAdmin` middleware for admin-only routes:

```typescript
import { requireSession, requireAdmin } from "../../../../middleware/index.ts";

// Admin-only route
router.delete("/:id", requireSession, requireAdmin, controller.delete);
```

### Accessing User Information

In protected routes, user and session data is available on the request object:

```typescript
// In your controller
export async function getProfile(req: Request, res: Response) {
  const user = (req as any).user;      // User object
  const session = (req as any).session; // Session object
  
  return res.json({ user, session });
}
```

### Authentication Methods

Better Auth supports multiple authentication methods:

1. **Email & Password** - Traditional email/password login
2. **Magic Link** - Passwordless login via email link
3. **Email OTP** - One-time password sent via email
4. **Username** - Username-based authentication
5. **Two-Factor Authentication (2FA)** - Additional security layer

### Frontend Integration

Configure the Better Auth client in your Next.js application:

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3001", // Backend URL
});

export const { signIn, signUp, signOut, useSession } = authClient;
```

## ✅ Validation

Always validate request data using Zod schemas:

```typescript
import { z } from 'zod';
import { validateBody, validateQuery, validateParams } from '@middleware/validator';

// Define schema
const createItemSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
});

// Apply to route
router.post('/', validateBody(createItemSchema), controller.create);
```

## 🔄 Versioning

### URL Versioning
All API endpoints are versioned in the URL:
- `/api/v1/items` - Version 1
- `/api/v2/items` - Version 2 (future)

### Creating a New Version
1. Copy `src/app/routes/v1/` to `src/app/routes/v2/`
2. Make your changes in v2
3. Update `src/app/routes/index.ts` to include v2 routes
4. Maintain v1 for backward compatibility

## 📝 Naming Conventions

### Endpoints
- Use **plural nouns** for resources: `/items`, `/users`
- Use **kebab-case** for multi-word resources: `/user-profiles`
- Use **nouns**, not verbs: `/users` not `/getUsers`

### HTTP Methods
- `GET` - Retrieve resource(s)
- `POST` - Create new resource
- `PUT` - Update entire resource
- `PATCH` - Update partial resource
- `DELETE` - Delete resource

### Examples
```
GET    /api/v1/items          # Get all items
GET    /api/v1/items/:id      # Get single item
POST   /api/v1/items          # Create item
PUT    /api/v1/items/:id      # Update item
DELETE /api/v1/items/:id      # Delete item
```

## 🔒 Security

### Rate Limiting
- Default: 100 requests per 15 minutes
- Strict endpoints: 5 requests per 15 minutes
- Customize per route as needed

### CORS
- Configure allowed origins in `.env`
- Enable credentials for authenticated requests
- Whitelist specific headers
- Use explicit origins (not `*`) when credentials are enabled

### Input Validation
- Always validate all user input
- Use Zod schemas for type-safe validation
- Sanitize input data

### Authentication & Authorization
- All protected routes require valid session
- Use `requireSession` middleware for authentication
- Use `requireAdmin` middleware for admin-only endpoints
- Session tokens are managed by Better Auth
- User data is attached to request object in protected routes

### Headers
Required headers for all requests:
- `Content-Type: application/json`
- `X-Correlation-ID: <uuid>` (optional, auto-generated if not provided)

## 📊 Pagination

Default pagination parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

Example:
```
GET /api/v1/items?page=2&limit=20
```

## 🏷️ Filtering and Sorting

### Filtering
```
GET /api/v1/items?status=active&category=electronics
```

### Sorting
```
GET /api/v1/items?sort=createdAt&order=desc
```

## 📅 Timestamps

All timestamps should be in ISO 8601 format:
```
2025-01-18T12:00:00.000Z
```

## 🔍 Search

Implement search with query parameter:
```
GET /api/v1/items?search=keyword
```

## 📚 Documentation

### Swagger Annotations
Document all endpoints with JSDoc comments:

```typescript
/**
 * @swagger
 * /api/v1/items:
 *   get:
 *     summary: Get all items
 *     tags: [Items]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of items
 */
router.get('/', controller.getAll);
```

## 🧪 Testing

Every endpoint should have:
- Unit tests for controllers
- Integration tests for full endpoint
- Validation tests for schemas

Example:
```typescript
describe('GET /api/v1/items', () => {
  it('should return paginated items', async () => {
    const response = await request(app)
      .get('/api/v1/items')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.meta).toBeDefined();
  });
});
```

---

**Remember:** Consistency is key! Follow these guidelines to maintain a clean and maintainable API.

