# Contributing to FleetX Backend

Thank you for considering contributing to this project! We welcome contributions from everyone. This guide will help you get started quickly.

---

## 🚀 Quick Start

### 1. Fork & Clone
```bash
# Fork the repository on GitHub
git clone https://github.com/YOUR-USERNAME/fleetx-backend.git
cd fleetx-backend
```

### 2. Install Dependencies
```bash
bun install
```

### 3. Create a Branch
```bash
# Use meaningful branch names
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

---

## 📝 Making Changes

### Branch Naming Convention

We follow **GitHub Flow** with clear naming:

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring
- `test/description` - Test updates
- `perf/description` - Performance improvements

**Examples:**
```bash
feature/user-authentication
fix/rate-limit-bug
docs/update-readme
refactor/controller-logic
```

---

## 💬 Commit Messages (Automated)

We use **Commitizen** for automated, standardized commit messages.

### How to Commit

**Instead of:**
```bash
git commit -m "your message"
```

**Use:**
```bash
git add .
bun run commit
```

This will guide you through:
1. **Type** - What kind of change? (feat, fix, docs, etc.)
2. **Scope** - What part? (auth, api, database, etc.)
3. **Description** - Short summary
4. **Body** - Detailed description (optional)
5. **Breaking changes** - If any (optional)

### Example Flow
```bash
$ bun run commit

? Select the type of change: ✨ feat: A new feature
? What is the scope?: api
? Write a short description: add pagination to items endpoint
? Provide a longer description: (skip or add details)
? Are there any breaking changes?: No
? Does this close any issues?: Closes #42

✅ Generated: feat(api): add pagination to items endpoint
```

### Commit Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `perf` - Performance
- `test` - Tests
- `build` - Build system
- `ci` - CI/CD
- `chore` - Maintenance

---

## 🧪 Testing

### Run Tests Before Committing
```bash
# Run all tests
bun test

# Watch mode
bun run test:watch

# Coverage report
bun run test:coverage
```

### Writing Tests
```typescript
// tests/integration/feature.test.ts
describe('Feature', () => {
  it('should work correctly', async () => {
    const response = await request(app)
      .get('/api/v1/endpoint')
      .expect(200);
    
    expect(response.body.success).toBe(true);
  });
});
```

---

## ✅ Pre-Commit Checklist

Our **Git hooks automatically check**:
- ✅ Code linting (Biome)
- ✅ Code formatting
- ✅ Commit message format

**Manually verify:**
- [ ] Tests pass: `bun test`
- [ ] Type check: `bun run type-check`
- [ ] No console.log() statements
- [ ] Documentation updated (if needed)

---

## 🔄 Pull Request Process

### 1. Push Your Changes
```bash
git push origin feature/your-feature-name
```

### 2. Create Pull Request
- Go to GitHub
- Click "New Pull Request"
- Fill in the **PR template** (auto-populated)
- Link related issues: `Closes #123`

### 3. Wait for Review
- CI will automatically run tests
- Reviewers will provide feedback
- Address any requested changes

### 4. Merge
- Once approved, your PR will be merged
- Branch will be deleted automatically

---

## 📦 Code Style

We use **Biome** for formatting and linting:

```bash
# Check code
bun run lint

# Auto-fix issues
bun run lint:fix

# Format code
bun run format
```

### Style Rules
- ✅ Use TypeScript strict mode
- ✅ Use `const` over `let`
- ✅ Add JSDoc comments for functions
- ✅ Use path aliases: `@core/`, `@middleware/`
- ✅ Handle errors with `asyncHandler`
- ✅ Validate input with Zod schemas

---

## 🎯 API Development Guidelines

### Adding a New Endpoint

1. **Create Zod Schema**
```typescript
// src/app/routes/v1/schemas/feature.schema.ts
export const createFeatureSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string(),
});
```

2. **Create Controller**
```typescript
// src/controllers/feature.controller.ts
export async function create(req, res) {
  const data = req.body;
  // Business logic here
  return created(res, result, 'Feature created');
}
```

3. **Create Route**
```typescript
// src/app/routes/v1/feature.routes.ts
router.post('/', 
  validateBody(createFeatureSchema),
  asyncHandler(controller.create)
);
```

4. **Add Tests**
```typescript
// tests/integration/feature.test.ts
describe('POST /api/v1/features', () => {
  it('should create feature', async () => {
    // Test implementation
  });
});
```

---

## 🚀 Release Process (Automated)

Releases are automated with **standard-version**:

```bash
# Patch release (1.0.0 → 1.0.1)
bun run release:patch

# Minor release (1.0.0 → 1.1.0)
bun run release:minor

# Major release (1.0.0 → 2.0.0)
bun run release:major
```

This automatically:
- Bumps version in package.json
- Updates CHANGELOG.md
- Creates a git tag
- Commits changes

---

## 🐛 Bug Reports

Use the **Bug Report** template:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Error logs

---

## ✨ Feature Requests

Use the **Feature Request** template:
- Feature description
- Problem it solves
- Proposed solution
- Acceptance criteria

---

## ❓ Questions

- Use the **Question** template
- Check documentation first
- Be specific and provide context

---

## 📚 Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Project Documentation](./docs/)

---

## 🤝 Code Review Guidelines

### As a Reviewer
- ✅ Be respectful and constructive
- ✅ Focus on code quality, not personal style
- ✅ Suggest improvements, don't demand
- ✅ Respond within 48 hours
- ✅ Approve or request changes clearly

### As an Author
- ✅ Respond to all feedback
- ✅ Don't take feedback personally
- ✅ Ask for clarification if needed
- ✅ Update PR based on feedback
- ✅ Re-request review when ready

---

## 🎉 Recognition

All contributors will be recognized in our README and releases.

Thank you for contributing! 🚀

---

**Questions?** Open an issue with the Question template.
