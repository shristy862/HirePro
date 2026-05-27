# HireFlow

AI-assisted hiring platform with two role-based experiences:
- **Recruiter**: post jobs, review applications, update statuses
- **Jobseeker**: discover jobs, apply, track progress, improve profile

## 1) Clone and install

```bash
git clone https://github.com/shristy862/HirePro
cd hireflow-ai
```

Install both apps:

```bash
cd backend && npm install
cd ../frontend && npm install
```

## 2) Environment variables (required)

`.env` files are mandatory for local/dev and production.

Backend (`backend/.env`) required keys:
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_URL` (for example: `http://localhost:5173`)
- AI keys if enabled (`GEMINI_API_KEY` and/or `HF_TOKEN`)

Frontend (`frontend/.env.local`) required key:
- `NEXT_PUBLIC_API_URL` (for example: `http://localhost:5000/api/v1`)

You can start from:
- `frontend/.env.example`
- your existing `backend/.env`

## 3) Run the app

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Open: `http://localhost:5173`

## How to use

### Recruiter flow
1. Sign up/login as `recruiter`
2. Create job posts from Jobs
3. Open Applications to review candidates
4. View application detail and update status
5. Use Settings to update account/profile picture

### Jobseeker flow
1. Sign up/login as `candidate`
2. Complete profile and upload resume
3. Browse jobs and apply
4. Save jobs for later
5. Track statuses in My Applications and improve profile from AI feedback

## Tech stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS + shadcn/ui + lucide-react
- Axios + React Hook Form + Zod + Recharts + Sonner
