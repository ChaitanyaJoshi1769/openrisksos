# OpenRiskOS Development Guide

Welcome to the OpenRiskOS development environment! This guide will help you set up your local development environment and start contributing.

## Prerequisites

- **Node.js:** v20 or higher
- **pnpm:** v9 or higher (`npm install -g pnpm@9`)
- **Docker & Docker Compose:** For running containerized services
- **Git:** For version control
- **PostgreSQL:** (optional, Docker handles this)
- **Redis:** (optional, Docker handles this)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/openrisks/openrisksos.git
cd openrisksos
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Development Services

Start all infrastructure services (PostgreSQL, Redis, Neo4j, Kafka, etc.) using Docker Compose:

```bash
docker-compose up -d
```

Verify services are running:

```bash
docker-compose ps
```

### 4. Set Up Database

Create `.env` file in the root:

```bash
cp packages/database/.env.example .env
```

Update `DATABASE_URL` if needed:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/openrisksos"
```

Run migrations:

```bash
pnpm db:migrate
```

Seed sample data (optional):

```bash
pnpm db:seed
```

Open Prisma Studio to explore data:

```bash
pnpm db:studio
```

### 5. Start Development Environment

Run all services in development mode:

```bash
pnpm dev
```

This starts:
- **Web App:** http://localhost:3000
- **Risk Service:** http://localhost:3001
- **API Gateway:** http://localhost:3002 (when implemented)
- **Keycloak:** http://localhost:8080
- **Grafana:** http://localhost:3000 (dashboard)

### 6. Verify Setup

Check API health:

```bash
curl http://localhost:3001/health
```

You should see:

```json
{ "status": "ok" }
```

## Project Structure

```
openrisksos/
├── apps/                    # Applications
│   ├── web/                 # Next.js dashboard
│   ├── mobile/              # React Native apps
│   └── cli/                 # Command-line tools
├── services/                # NestJS microservices
│   ├── risk-service/        # Risk management
│   ├── compliance-service/  # Compliance management
│   ├── incident-service/    # Incident management
│   └── ...
├── packages/                # Shared libraries
│   ├── database/            # Prisma schemas
│   ├── api-client/          # API SDK
│   ├── shared-types/        # TypeScript types
│   └── ...
├── sdk/                     # Official SDKs
│   └── api-client/
├── infrastructure/          # IaC & K8s
│   ├── terraform/
│   └── k8s/
├── docs/                    # Documentation
└── docker-compose.yml       # Local dev stack
```

## Common Development Tasks

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### Linting & Formatting

```bash
# Check code style
pnpm lint

# Fix issues
pnpm lint:fix

# Format code
pnpm format
```

### Type Checking

```bash
# Check TypeScript types across monorepo
pnpm typecheck
```

### Building

```bash
# Build all packages
pnpm build

# Production build
pnpm build:prod
```

## Service Development

### Creating a New Service

1. Create service directory in `services/`:

```bash
mkdir services/my-service
cd services/my-service
```

2. Create `package.json` (use existing service as template)

3. Create NestJS structure:

```bash
mkdir -p src/{modules,common,config}
```

4. Implement service modules, controllers, resolvers

5. Add to `pnpm-workspace.yaml` if not auto-detected

6. Install dependencies:

```bash
pnpm install
```

### Service Template

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3001);
}

bootstrap();
```

## Database Development

### Creating Migrations

```bash
# Create a new migration
pnpm db:migrate:create

# Review and edit the migration in `packages/database/prisma/migrations/`

# Apply migration
pnpm db:migrate
```

### Updating Schema

1. Edit `packages/database/prisma/schema.prisma`
2. Create migration: `pnpm db:migrate:create`
3. Apply: `pnpm db:migrate`
4. Verify with `pnpm db:studio`

### Seeding Data

Edit `packages/database/scripts/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample data
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Sample Tenant',
      slug: 'sample-tenant',
    },
  });
  console.log('Created tenant:', tenant);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run: `pnpm db:seed`

## Frontend Development

### Web App

The web app is in `apps/web/` and uses **Next.js 15** with TypeScript.

Start: `pnpm dev`

Key files:
- `apps/web/src/app/` - App directory (pages, layouts)
- `apps/web/src/components/` - React components
- `apps/web/src/lib/` - Utilities and helpers
- `apps/web/tailwind.config.js` - Styling

### UI Components

We use **shadcn/ui** components. Add new components:

```bash
npx shadcn-ui@latest add button
```

## API Development

### REST Endpoints

Create controllers in service modules:

```typescript
@Controller('api/v1/risks')
export class RisksController {
  @Get()
  async getRisks() { }

  @Post()
  async createRisk(@Body() dto: CreateRiskDto) { }

  @Get(':id')
  async getRisk(@Param('id') id: string) { }

  @Put(':id')
  async updateRisk(@Param('id') id: string, @Body() dto: UpdateRiskDto) { }

  @Delete(':id')
  async deleteRisk(@Param('id') id: string) { }
}
```

### GraphQL Resolvers

Create resolvers:

```typescript
@Resolver('Risk')
export class RisksResolver {
  @Query()
  async risks(@Args('filter') filter?: RiskFilterDto) { }

  @Mutation()
  async createRisk(@Args('input') input: CreateRiskDto) { }
}
```

## Authentication Development

We use **Keycloak** for auth. Default credentials:

```
Username: admin
Password: admin123
```

Access at: http://localhost:8080

To add JWT authentication to services:

```typescript
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Get()
async getRisks(@Req() req) {
  const userId = req.user.id;
  // ...
}
```

## Debugging

### VS Code

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Risk Service",
      "program": "${workspaceFolder}/services/risk-service/src/main.ts",
      "preLaunchTask": "pnpm: dev",
      "runtimeArgs": ["--loader", "ts-node/esm"],
      "protocol": "inspector"
    }
  ]
}
```

### Docker Logs

```bash
# View all logs
docker-compose logs

# Follow logs
docker-compose logs -f

# Specific service
docker-compose logs -f postgres
```

## Environment Variables

Create `.env` in root:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/openrisksos

# Services
PORT=3001
NODE_ENV=development
LOG_LEVEL=debug

# Auth
JWT_SECRET=your-secret-key
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=openrisksos

# API
API_URL=http://localhost:3001
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# OpenAI (for AI features)
OPENAI_API_KEY=your-api-key
```

## Performance Optimization

### Profiling

```bash
# Generate CPU profile
node --prof services/risk-service/dist/main.js

# Process profile
node --prof-process isolate-*.log > profile.txt
```

### Database Query Optimization

Use Prisma Studio to understand queries:

```bash
pnpm db:studio
```

Check query plans:

```sql
EXPLAIN ANALYZE SELECT * FROM risks;
```

## Troubleshooting

### Port Already in Use

```bash
# Find process on port 3001
lsof -i :3001

# Kill process
kill -9 <PID>
```

### Database Connection Issues

```bash
# Reset database
docker-compose down -v
docker-compose up -d postgres

# Wait for postgres to be healthy
docker-compose ps
```

### Node modules issues

```bash
# Clean install
pnpm clean
pnpm install
```

## Code Style & Conventions

- **TypeScript:** Strict mode enabled
- **Imports:** Absolute paths using `@` alias
- **Naming:** camelCase for variables/functions, PascalCase for classes/types
- **Comments:** Only for "why", not "what"
- **Testing:** Jest, minimum 80% coverage

## Git Workflow

1. Create feature branch: `git checkout -b feat/my-feature`
2. Make changes and commit: `git commit -m "feat: add my feature"`
3. Push: `git push origin feat/my-feature`
4. Create Pull Request
5. Wait for CI/CD to pass
6. Get review approval
7. Merge to develop

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details on:
- Code style guidelines
- Commit message format
- Pull request process
- License agreement

## Resources

- **[Architecture Docs](./docs/ARCHITECTURE.md)** - System design
- **[PRD](./docs/PRD.md)** - Product requirements
- **[API Docs](./docs/API.md)** - API reference
- **[Database Schema](./packages/database/prisma/schema.prisma)** - Data model

## Getting Help

- **GitHub Issues:** Report bugs or request features
- **GitHub Discussions:** Ask questions
- **Email:** dev@openrisks.io
- **Slack:** Join our community

---

Happy developing! 🚀
