# Contributing to Backend Express Starter

Thank you for considering contributing to this project! We welcome contributions from everyone.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `bun install`
4. Create a branch: `git checkout -b feature/your-feature`

## 📝 Development Workflow

1. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic

2. **Test your changes**
   ```bash
   bun test
   bun run lint
   bun run type-check
   ```

3. **Commit your changes**
   - Write clear, descriptive commit messages
   - Use conventional commit format (optional but recommended):
     - `feat: add new feature`
     - `fix: fix bug`
     - `docs: update documentation`
     - `test: add tests`
     - `refactor: refactor code`

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature
   ```
   - Open a Pull Request on GitHub
   - Describe your changes clearly
   - Link any related issues

## 🧪 Testing Requirements

- All new features must include tests
- Maintain or improve code coverage
- Both unit and integration tests should pass

## 📚 Documentation

- Update README.md if needed
- Add JSDoc comments to functions
- Update Swagger annotations for API changes

## 🎨 Code Style

We use Biome for code formatting and linting:

```bash
bun run lint:fix
bun run format
```

## ✅ Pull Request Checklist

- [ ] Code follows project style
- [ ] Tests added and passing
- [ ] Documentation updated
- [ ] No linting errors
- [ ] TypeScript compiles without errors
- [ ] PR description is clear

## 🐛 Bug Reports

When reporting bugs, please include:

- Operating system and version
- Node/Bun version
- Steps to reproduce
- Expected vs actual behavior
- Error messages and stack traces

## 💡 Feature Requests

We welcome feature requests! Please:

- Check if it's already been requested
- Explain the use case
- Describe the proposed solution

## 📞 Questions?

Feel free to open an issue for any questions or concerns.

Thank you for contributing! 🎉

