# AI Agent Assessment Project

A modern, multi-agent customer support system built with a monorepo architecture. It features a specialized routing system that classifies user intent and delegates tasks to specific sub-agents (Order, Billing, and Support).

## 🏗 Architecture

This project is a monorepo managed by **Turborepo** and **npm**:

- **apps/api**: Hono-based backend using the Vercel AI SDK, Prisma, and tsx.
- **apps/web**: React frontend (Vite) with Tailwind CSS and Material Design principles.
- **packages/eslint-config**: Shared linting rules.
- **packages/typescript-config**: Shared TypeScript configurations.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v10.9.4 or higher
- **Docker**: For running the PostgreSQL database

### 1. Clone and Install

```bash
git clone git@github.com:santanu2310/assessment-project.git
cd assessment-project
npm install
```

### 2. Database Setup (Docker)

The project uses Docker Compose to manage a PostgreSQL instance.

```bash
# Start the database in the background
docker compose up -d
```

### 3. Environment Configuration

Create a `.env` file in `apps/api/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/assessment_db?schema=public"
GOOGLE_GENERATIVE_AI_API_KEY="your_api_key_here"
```

### 4. Database Migration & Seeding

```bash
cd apps/api
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Running the Project

You can start both the API and Web app simultaneously from the root directory:

```bash
npm run dev
```

The apps will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

## 🛠 Project Commands

- `npm run build`: Build all apps and packages.
- `npm run dev`: Start all apps in development mode with hot-reloading.
- `npm run lint`: Run linting across the entire monorepo.
- `npm run format`: Format code using Prettier.

## 🤖 Agent System

- **Classifier**: Analyzes the first message to route the user.
- **Order Agent**: Handles tracking (e.g., `ORD-1002`) and shipping.
- **Billing Agent**: Handles invoices, refunds, and payments.
- **Support Agent**: Handles general FAQs and technical help.

Each agent is equipped with specific tools and uses `maxSteps` to perform multi-turn reasoning and tool execution.
