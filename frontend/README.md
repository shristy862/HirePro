# HireFlow — Frontend

Recruitment automation SaaS built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Sign in |
| `/signup` | Create account |
| `/recruiter` | Recruiter dashboard |
| `/candidate` | Candidate dashboard |
| `/jobs` | Jobs listing with search & filters |
| `/jobs/[id]` | Job details |
| `/applications` | Applications table |
| `/settings` | Profile & notifications |

## Environment

Copy `.env.example` to `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

When the backend is offline, the app uses mock data automatically.

## Deploy (Vercel)

1. Import the `frontend` folder as a Vercel project.
2. Set `NEXT_PUBLIC_API_URL` to your production API.
3. CI runs via `.github/workflows/frontend-ci.yml` on push.

## Stack

- Next.js 16 App Router · React 19 · TypeScript
- Tailwind CSS 4 · shadcn/ui · lucide-react
- next-themes (auto day/night + manual toggle)
- react-hook-form · zod · axios · recharts · sonner
