# Task Tracker — Full-Stack CRUD Application

A full-stack task management application built with **Next.js 16 (App Router)**, **TypeScript**, **Drizzle ORM**, **PostgreSQL (Supabase)**, and **Zod**. Designed with clean container/presentational component architecture, server-side pagination, URL-synchronized state, and automated CI checks.

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router), React 19, TypeScript 5 |
| **Styling & Icons** | Tailwind CSS v4, Lucide React |
| **Database & ORM** | PostgreSQL (Supabase Cloud Pooler / Local Postgres), Drizzle ORM, `node-postgres` (`pg`) |
| **Validation** | Zod v4 |
| **CI / Deployment** | GitHub Actions, Vercel |


## Getting Started Locally

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/wefindways/my-crud-app.git
cd my-crud-app
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory and provide your PostgreSQL connection string (local Postgres or Supabase Transaction/Session Pooler on port `6543`):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_tracker"
```

### 3. Push Schema & Seed the Database

```bash
# Push Drizzle schema to PostgreSQL
npm run db:push

# (Optional) Seed sample tasks
npm run db:seed
```

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local Next.js development server |
| `npm run build` | Builds the application for production |
| `npm run lint` | Runs ESLint across the codebase |
| `npx tsc --noEmit` | Runs TypeScript static type checking |
| `npm run db:push` | Pushes Drizzle schema changes directly to PostgreSQL |
| `npm run db:seed` | Seeds the database with sample tasks |
| `npm run db:studio` | Opens Drizzle Studio to inspect database tables visually |
