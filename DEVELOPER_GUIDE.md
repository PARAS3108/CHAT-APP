# Developer Guide — Chat-App

This guide explains the project from the smallest building blocks to the highest-level architecture and runtime flows. Use it to understand, extend, debug, or onboard other developers.

Contents
- Overview
- Local development quick-start
- Project structure (file map)
- Backend internals
  - Node/Express basics
  - Authentication flow (JWT cookie)
  - Database models
  - Message send/receive flow
  - Socket.IO setup and online-users tracking
- Frontend internals
  - React component layout
  - Zustand stores and data flow
  - Socket client integration
  - Important components and how they interact
- Common debugging scenarios
- Deployment and production notes
- Suggested improvements and next steps

---

Overview
--------

Chat-App is a full-stack chat application demonstrating:
- REST endpoints for auth and messages
- JWT-based auth using httpOnly cookies
- Real-time messaging using Socket.IO
- Image upload (Cloudinary integration)
- Client state management using Zustand

Local development quick-start (recap)
-----------------------------------

1. Add required env vars in `backend/.env` (MONGODB_URI, JWT_KEY, Cloudinary credentials).
2. Start backend: `cd backend && npm install && npm run dev`.
3. Start frontend: `cd frontend && npm install && npm run dev` (Node >= 22.12 or >= 20.19 required for Vite).

Project structure (file map)
----------------------------

- backend/
  - package.json
  - src/
    - index.js — server boot (Express app + Socket.IO attach)
    - controller/
      - auth.controller.js — signup, login, logout, updateProfile, check
      - message.controller.js — get users, get conversation messages, send message
    - lib/
      - db.js — mongoose connection
      - socket.js — Socket.IO server setup and online-user map
      - token.js — JWT cookie sign helper
    - middleware/
      - auth.middleware.js — protects routes by verifying JWT from cookie
    - models/
      - user.model.js
      - message.model.js
    - routes/
      - auth.route.js
      - message.route.js

- frontend/
  - package.json
  - src/
    - main.jsx — app entry
    - App.jsx — top-level routes and layout
    - lib/
      - axios.js — preconfigured axios instance (withCredentials: true)
      - utils.js — helpers
    - store/
      - useAuthStore.js — authUser, socket connect/disconnect, onlineUsers
      - useChatStore.js — users, messages, selectedUser, unreadCounts, socket listener
    - components/
      - SideBar.jsx — contact list and unread badges
      - ChatContainer.jsx — messages view, subscribes to message listener
      - MessageInput.jsx — send messages
      - ChatHeader.jsx — current conversation header

Backend internals
-----------------

Node/Express basics
- `backend/src/index.js` creates an Express app, sets middlewares (JSON parser, cookie parser, CORS) and attaches Socket.IO to the HTTP server. It also mounts the auth and message routes.

Authentication flow (JWT cookie)
- Signup/Login: server validates credentials and then calls `generateToken(userId, res)` (see `lib/token.js`). This function signs a JWT and sets it as an httpOnly cookie named `jwt`.
- Client: `axiosInstance` uses `withCredentials: true` so browser sends cookies to the API.
- Middleware: `auth.middleware.js` reads `req.cookies.jwt`, verifies it, and attaches `req.userId` to requests when valid.

Database models (Mongoose)
- `user.model.js` — user fields (name, email, password hash, profilePic).
- `message.model.js` — message fields include `senderId`, `receiverId`, `text`, `image`, and timestamps.

Message send/receive flow
1. Client posts to POST `/api/messages/send/:receiverId` with message body (text/image).
2. Server saves message to MongoDB via Message model.
3. After saving, server checks `userSocketMap` (from `lib/socket.js`) for the receiver's socket id and emits a `newMessage` event to that socket with the saved message payload.

Socket.IO setup and online-users tracking
- `lib/socket.js` maintains a `userSocketMap` mapping `userId -> socketId`.
- When a socket connects, the server reads the userId from `socket.handshake.auth.userId` and sets it in the map.
- Server emits `online-users` (array of connected userIds) to all clients whenever someone connects/disconnects.

Frontend internals
------------------

React component layout
- `SideBar.jsx` shows contacts and unread badges.
- `ChatContainer.jsx` shows messages and uses `subscribeToMessages` / `clearMessages` to attach the client-side listener.

Zustand stores and data flow
- `useAuthStore.js`
  - Holds `authUser`, `socket`, `onlineUsers`, and connection helpers.
  - After a successful login or auth check, `connectSocket()` is called which instantiates `io(BASE_URL, { auth: { userId }, withCredentials: true })`.
- `useChatStore.js`
  - Holds `users`, `messages`, `selectedUser`, `unreadCounts`, and a `_messageListener` ref.
  - A persistent `newMessage` listener is attached once the socket is ready and does two things:
    - If the incoming message belongs to the opened conversation, it appends the message and resets unread for that sender.
    - Otherwise it increments unread for the sender.

Socket client integration
- The client receives `online-users` and `newMessage` events.
- Use `withCredentials: true` on the client socket so cookies/auth (if needed) are included in the handshake.

Important components and how they interact
- `Login/Signup` pages call auth endpoints via `axiosInstance` and then update `useAuthStore.authUser`.
- After auth, `useAuthStore` connects the socket and starts receiving `online-users`.
- `SideBar` relies on `useChatStore.users` and `useChatStore.unreadCounts` to render unread badges.
- `ChatContainer` fetches messages for the selected user and scrolls to the bottom.

Common debugging scenarios
-------------------------

- Vite won't start (Node version error) — ensure Node >= 22.12 or >= 20.19.
- Socket doesn't connect — check backend logs to ensure socket server started and CORS allowed origin `http://localhost:5173`.
- Cookies not sent — verify `token.js` cookie `sameSite` and `secure` settings; in development `sameSite: 'lax'` and secure false help local testing.
- `newMessage` events not delivered — check mapping in `userSocketMap` and ensure `receiverId` in message document matches the actual user id the client expects.

Deployment and production notes
-------------------------------

- Use HTTPS in production to allow `secure` cookies and `sameSite: none` if cross-site contexts are needed.
- Consider moving unread message counts to the server if you need cross-device consistency.
- Use environment-based CORS origins and lock down allowed origins.

Suggested improvements and next steps
-----------------------------------

- Add a small test suite for controllers and helper functions.
- Add logging (winston or pino) for server events and errors.
- Add Web Push or a notifications service to surface new chats outside the app.
- Add TypeScript to both frontend and backend for type safety and maintainability.

---

If you want, I can split this guide into two files (`BACKEND_GUIDE.md` and `FRONTEND_GUIDE.md`), add diagrams (SVG), or scaffold CI to run ESLint/format checks on PRs. Tell me which follow-up you'd like and I'll continue.
