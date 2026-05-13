# Contributing to OpenRiskOS

Thank you for your interest in contributing to OpenRiskOS! We welcome contributions from the community, whether it's bug reports, feature requests, documentation improvements, or code contributions.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and constructive in all interactions.

## Getting Started

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/openrisksos.git
   cd openrisksos
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

3. **Follow Development Setup**
   See [DEVELOPMENT.md](./DEVELOPMENT.md) for local setup

## Types of Contributions

### Bug Reports

If you find a bug, please:

1. **Check existing issues** to avoid duplicates
2. **Create a new issue** with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment (OS, Node version, etc.)
   - Screenshots/logs if applicable

### Feature Requests

For new features:

1. **Check existing discussions** for similar requests
2. **Start a discussion** or create an issue with:
   - Clear use case and motivation
   - Proposed solution (if any)
   - Alternatives considered
   - Potential impact

### Code Contributions

For code changes:

1. **Keep PRs focused** - One feature or fix per PR
2. **Small PRs are better** - Easier to review and merge
3. **Test your changes** - See Testing section below
4. **Follow code style** - See Style Guidelines below
5. **Update documentation** - Docs are just as important as code

## Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feat/my-awesome-feature
```

Branch naming conventions:
- `feat/...` - New features
- `fix/...` - Bug fixes
- `docs/...` - Documentation changes
- `refactor/...` - Code refactoring
- `perf/...` - Performance improvements
- `test/...` - Adding/improving tests

### 2. Make Changes

Follow the code style guidelines (see below).

### 3. Commit Messages

Use conventional commits:

```
type(scope): subject

Body (optional, explain what and why)

Fixes #123
```

Types:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (no logic change)
- `refactor:` - Code refactoring
- `perf:` - Performance improvement
- `test:` - Test changes
- `chore:` - Build, dependencies, etc.

Examples:
```
feat(risks): add risk heatmap visualization
fix(incidents): handle timezone conversion correctly
docs: update API endpoint documentation
refactor(compliance): simplify control validation logic
```

### 4. Push and Create Pull Request

```bash
git push origin feat/my-awesome-feature
```

Then create a PR on GitHub with:
- Clear title (what does this change?)
- Description (why is this needed?)
- Linked issues (`Fixes #123`)
- Screenshots/videos if UI changes
- Testing instructions

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** - No `any` types
- **Explicit return types** - Required for all functions
- **Comments only for "why"** - Not for "what"
- **Avoid console.log** - Use proper logging

```typescript
// ✅ Good
async function getUserRisks(userId: string): Promise<Risk[]> {
  return db.risk.findMany({ where: { ownerId: userId } });
}

// ❌ Bad
async function getRisks(userId) {
  console.log('getting risks');
  return db.risk.findMany({ where: { ownerId: userId } });
}
```

### Naming Conventions

- **Variables/Functions:** `camelCase`
- **Classes/Types:** `PascalCase`
- **Constants:** `UPPER_SNAKE_CASE`
- **Interfaces:** `PascalCase` (no `I` prefix)

```typescript
// ✅ Good
interface UserRisk {
  id: string;
  title: string;
}

const MAX_RETRY_ATTEMPTS = 3;

function calculateRiskScore(): number {}

// ❌ Bad
interface IUserRisk {}
const max_retry = 3;
function calculate_risk_score() {}
```

### Formatting

We use Prettier for consistent formatting:

```bash
pnpm format
```

All PRs must pass:
```bash
pnpm lint
pnpm typecheck
pnpm format
```

## Testing

### Coverage Requirements

- Minimum **80% code coverage**
- **100% coverage** for critical paths (auth, risk scoring, etc.)
- All public APIs must be tested

### Writing Tests

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { RisksService } from './risks.service';

describe('RisksService', () => {
  let service: RisksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RisksService],
    }).compile();

    service = module.get<RisksService>(RisksService);
  });

  it('should create a risk', async () => {
    const risk = await service.createRisk('tenant-1', {
      title: 'Test Risk',
      probability: 3,
      inherentImpact: 4,
      ownerId: 'user-1',
      riskCategory: 'operational',
    });

    expect(risk).toBeDefined();
    expect(risk.title).toBe('Test Risk');
  });
});
```

### Running Tests

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage

# E2E tests
pnpm test:e2e
```

## Database Changes

When modifying the database schema:

1. **Edit** `packages/database/prisma/schema.prisma`
2. **Create migration**
   ```bash
   pnpm db:migrate:create --name add_new_field
   ```
3. **Review** generated migration in `prisma/migrations/`
4. **Apply** migration
   ```bash
   pnpm db:migrate
   ```
5. **Test** with seed data if applicable

## Documentation

Always keep documentation up-to-date:

- **Code comments** for complex logic
- **README.md** for overview changes
- **API docs** for endpoint changes
- **DEVELOPMENT.md** for setup changes
- **Inline docs** using JSDoc/TSDoc

Example:
```typescript
/**
 * Calculate risk score based on probability and impact
 * @param probability Risk probability (1-5)
 * @param impact Business impact (1-5)
 * @returns Risk score (1-25)
 */
function calculateScore(probability: number, impact: number): number {
  return probability * impact;
}
```

## PR Review Process

1. **Automated checks** must pass:
   - Linting
   - Type checking
   - Tests
   - Build

2. **Code review** from maintainers:
   - Design feedback
   - Logic correctness
   - Performance concerns
   - Security issues

3. **Approval** required before merge

4. **Merge strategy:**
   - Squash commits for small changes
   - Keep commits for major features

## Common Pitfalls

### Don't...

- ❌ Make unrelated changes in one PR
- ❌ Skip tests or have low coverage
- ❌ Commit commented-out code
- ❌ Use `console.log` for logging
- ❌ Create SQL injections or XSS vulnerabilities
- ❌ Add dependencies without discussion
- ❌ Break backward compatibility without version bump
- ❌ Write overly complex logic without comments

### Do...

- ✅ Keep PRs small and focused
- ✅ Write tests for new features
- ✅ Follow code style guidelines
- ✅ Use TypeScript strictly
- ✅ Document complex logic
- ✅ Ask questions in PR if unclear
- ✅ Be respectful and open to feedback
- ✅ Test your changes locally

## Release Process

Releases follow [Semantic Versioning](https://semver.org/):

- **MAJOR** - Breaking changes
- **MINOR** - New features (backward compatible)
- **PATCH** - Bug fixes

Releases are automated with GitHub Actions when tags are created:

```bash
git tag v0.2.0
git push origin v0.2.0
```

## Recognition

Contributors will be recognized in:

- `CONTRIBUTORS.md` file
- Release notes
- GitHub contributors page

Thank you for making OpenRiskOS better! 🙏

## Questions?

- **GitHub Discussions:** Ask community
- **Issues:** Report bugs or discuss features
- **Email:** contributors@openrisks.io

---

**Let's build the future of open-source GRC together!** 🚀
