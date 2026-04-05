# ImageSplit

This repository has been reorganized into two main folders:

- `frontend/` — the Next.js application
- `backend/` — the Node.js user backend

## Running the frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Running the backend

```bash
cd backend
npm install
npm run dev
```

The backend exposes user APIs at `http://localhost:4000/api/auth`.

## Notes

- The editor page (`/edit`) is now protected and redirects to `/login` for unauthenticated users.
- The frontend stores a JWT token in `localStorage` and sends it to the backend for session checks.
- If you want to change the backend URL, set `NEXT_PUBLIC_API_URL` in `frontend/.env.local`.

## Development

The frontend still uses Next.js storefront conventions, and the backend is a simple Express app with user registration, login, and session validation.
