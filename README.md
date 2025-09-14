# Chat-App

An opinionated, minimal chat application built with Node.js (Express + Socket.IO) on the backend and React (Vite) on the frontend. It demonstrates real-time messaging, JWT auth via httpOnly cookies, image upload (Cloudinary), and a small client state model using Zustand.

This repository contains two main folders:
- `backend/` — Express server, Socket.IO setup, controllers, and Mongoose models.
- `frontend/` — React app (Vite) with components, stores, and pages.

## Quick start (development)

Prerequisites:
- Node.js >= 22.12 (or >= 20.19)
- npm
- MongoDB (connection string)

1. Clone the repository

   git clone https://github.com/PARAS3108/CHAT-APP.git
   cd CHAT-APP

2. Environment variables

   Create a `.env` file inside `backend/` with at least the following values:

   MONGODB_URI=<your_mongo_uri>
   JWT_KEY=<a_secret_for_jwt>
   CLOUDINARY_CLOUD_NAME=<cloud_name>
   CLOUDINARY_API_KEY=<api_key>
   CLOUDINARY_API_SECRET=<api_secret>

3. Install dependencies

   cd backend; npm install
   cd ../frontend; npm install

4. Start servers

   # Backend (dev)
   cd backend; npm run dev

   # Frontend (dev)
   cd frontend; npm run dev

Open the frontend URL printed by Vite (usually http://localhost:5173) and register/login to test real-time chat.

## Project structure

- backend/
  - src/
    - controller/ — auth & message controllers
    - lib/ — socket, token helpers, db bootstrap
    - middleware/ — auth middleware
    - models/ — Mongoose schemas
    - routes/ — API routes
- frontend/
  - src/
    - components/ — UI components
    - pages/ — top-level pages (Login, Signup, Home)
    - store/ — Zustand stores for auth & chat state

## Development notes

- Socket events are named explicitly in code (e.g., `online-users`, `newMessage`). Keep both client and server in sync.
- The app uses an httpOnly cookie (`jwt`) for authentication. Axios requests set `withCredentials: true`.
- Unread message counts are kept in the client store (Zustand). For persistence across devices, consider moving unread-tracking server-side.

## Tests and CI

No automated tests are included. Recommended CI steps:
- Install, lint, and run type checks (if you add TypeScript)
- Optionally run unit tests against critical helpers

## Contributing

See `CONTRIBUTING.md` for contribution guidelines and code style.

## License

This project currently has no explicit license. Add a `LICENSE` file if you want to open-source it.
