# Virtual MediQueue

> A virtual queue management system for hospitals — book online, track your queue position in real time, and walk in only when your number is up.

<p>
  <img alt="MERN" src="https://img.shields.io/badge/stack-MERN-15827e?style=flat-square" />
  <img alt="Realtime" src="https://img.shields.io/badge/realtime-Socket.io-15827e?style=flat-square" />
  <img alt="Auth" src="https://img.shields.io/badge/auth-JWT%20%2B%20Refresh-15827e?style=flat-square" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-1ba39d?style=flat-square" />
</p>

---

## What it does

Long hospital waits are a solved problem on the patient side, mostly unsolved at the queue side. Virtual MediQueue digitises both:

- **Patients** sign up, find a doctor, book an appointment, and watch their queue position update live.
- **Doctors** register their practice, set weekly availability, post 24-hour announcements (running late, schedule changes), and check patients in/out of the queue.
- The **server** assigns monotonically increasing queue numbers per doctor per day, enforces availability windows, and broadcasts queue changes over WebSockets only to clients watching that specific doctor.

## Highlights

- **MERN stack** — MongoDB, Express, React, Node.
- **Real-time queue** via Socket.io with per-doctor rooms, so a heavy hospital chain doesn't fan out updates to unrelated clients.
- **Proper auth** — bcrypt-hashed passwords, short-lived access tokens + rotating refresh tokens, httpOnly cookies, automatic refresh on 401.
- **Role-based access** — `patient`, `doctor`, `admin` enforced on every protected route via middleware.
- **Hardened API** — `helmet`, CORS, request rate limiting, MongoDB query sanitisation, Zod schema validation on every input.
- **Atomic queue numbering** — per-doctor-per-day counter via `findOneAndUpdate(..., { upsert: true })` so two booking requests at the same instant can never collide.
- **TTL announcements** — 24-hour announcements expire automatically via Mongo's TTL index, no cron needed.
- **Considered UI** — refined medical aesthetic, Plus Jakarta Sans + Fraunces, brand teal palette, generous whitespace, animated live indicators.

## Architecture

```
                      ┌───────────────────────────────┐
                      │   React + Vite + Tailwind     │
   Patient browser ──►│   - AuthContext (httpOnly)    │
                      │   - useQueueSocket(doctorId)  │
                      └───────────────┬───────────────┘
                              REST /api    WS /socket.io
                                      ▼
                      ┌───────────────────────────────┐
                      │ Express 4 + Socket.io 4       │
                      │  middleware:                  │
                      │   helmet · cors · cookies     │
                      │   rate-limit · sanitize · zod │
                      │  controllers ─► services      │
                      │   - auth · doctor             │
                      │   - appointment · contact     │
                      │  sockets:                     │
                      │   queue:join / queue:update   │
                      └───────────────┬───────────────┘
                                      ▼
                      ┌───────────────────────────────┐
                      │ MongoDB (Mongoose 8)          │
                      │ User · Doctor · Announcement  │
                      │ Appointment · Counter         │
                      │ ContactMessage                │
                      └───────────────────────────────┘
```

## Project structure

```
virtual-mediqueue/
├── backend/
│   ├── src/
│   │   ├── config/         # env loading, DB connection
│   │   ├── controllers/    # auth, doctor, appointment, contact
│   │   ├── middleware/     # auth (RBAC), validate (zod), error, availability
│   │   ├── models/         # mongoose schemas
│   │   ├── routes/         # /api/auth, /api/doctors, /api/appointments, /api/contact
│   │   ├── sockets/        # socket.io setup, per-doctor rooms
│   │   ├── utils/          # ApiError, ApiResponse, jwt, logger
│   │   ├── validators/     # zod schemas
│   │   ├── app.js          # express app builder
│   │   └── server.js       # entry point (DB → HTTP → sockets → graceful shutdown)
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/            # axios client with refresh interceptor
│   │   ├── components/
│   │   │   ├── layout/     # Navbar, Footer, Layout
│   │   │   └── ui/         # Spinner, Modal, StatusBadge, EmptyState
│   │   ├── context/        # AuthContext
│   │   ├── hooks/          # useQueueSocket
│   │   ├── pages/          # Home, Login, Signup, AllDoctors, DoctorDetails,
│   │   │                   #   DoctorRegister, MyAppointments, NotFound
│   │   ├── routes/         # ProtectedRoute
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Quick start

### Option 1 — Docker Compose (one command)

```bash
git clone <your-repo-url> virtual-mediqueue
cd virtual-mediqueue

# Generate JWT secrets and put them in your shell env (or pass via .env)
export ACCESS_TOKEN_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
export REFRESH_TOKEN_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

docker compose up --build
```

Visit `http://localhost:5173`. The API is on `http://localhost:8000`.

### Option 2 — Manual

You need MongoDB running locally (or a hosted Atlas URI), Node 18+, and npm.

**Backend**

```bash
cd backend
cp .env.example .env
# edit .env — at minimum, set MONGODB_URI and the two JWT secrets
npm install
npm run dev
```

**Frontend** (in a second terminal)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Environment variables

| Variable                  | Required | Default                  | Description                                |
| ------------------------- | :------: | ------------------------ | ------------------------------------------ |
| `NODE_ENV`                |          | `development`            | `development` or `production`              |
| `PORT`                    |          | `8000`                   | API port                                   |
| `CLIENT_ORIGIN`           |          | `http://localhost:5173`  | Frontend origin allowed by CORS            |
| `MONGODB_URI`             |    ✓     | —                        | Mongo connection string                    |
| `DB_NAME`                 |          | `MediQueue`              | Database name                              |
| `ACCESS_TOKEN_SECRET`     |    ✓     | —                        | Signing secret for short-lived JWTs        |
| `REFRESH_TOKEN_SECRET`    |    ✓     | —                        | Signing secret for refresh tokens          |
| `ACCESS_TOKEN_EXPIRES_IN` |          | `15m`                    | Lifetime of access tokens                  |
| `REFRESH_TOKEN_EXPIRES_IN`|          | `7d`                     | Lifetime of refresh tokens                 |
| `BCRYPT_SALT_ROUNDS`      |          | `12`                     | Cost factor for password hashing           |

## API reference

All endpoints are mounted under `/api`. Every response uses the envelope:

```json
{ "success": true, "statusCode": 200, "message": "...", "data": { /* … */ } }
```

### Auth

| Method | Path                | Auth | Body                                       |
| :----: | ------------------- | :--: | ------------------------------------------ |
| POST   | `/auth/register`    |  —   | `{ username, email, phone, password }`     |
| POST   | `/auth/login`       |  —   | `{ email, password }`                      |
| POST   | `/auth/logout`      |  ✓   | —                                          |
| POST   | `/auth/refresh`     |  —   | (uses `refreshToken` cookie)               |
| GET    | `/auth/me`          |  ✓   | —                                          |

### Doctors

| Method | Path                                  | Auth        | Notes                              |
| :----: | ------------------------------------- | :---------: | ---------------------------------- |
| GET    | `/doctors`                            | —           | List all doctors                   |
| GET    | `/doctors/search?q=&specialization=`  | —           | Filter by name / specialty         |
| GET    | `/doctors/:doctorId`                  | —           | Single doctor (with `isOwner`)     |
| POST   | `/doctors/register`                   | ✓           | Caller becomes the owning doctor   |
| GET    | `/doctors/:doctorId/announcements`    | —           | List active (24h-TTL) announcements|
| POST   | `/doctors/:doctorId/announcements`    | ✓ (owner)   | Post a new announcement            |

### Appointments

| Method | Path                                  | Auth | Notes                                    |
| :----: | ------------------------------------- | :--: | ---------------------------------------- |
| POST   | `/appointments/book`                  | ✓    | Honours the doctor's availability window |
| GET    | `/appointments/me`                    | ✓    | Caller's own appointments                |
| GET    | `/appointments/queue/:doctorId`       | ✓    | Today's queue (owner or booked patient)  |
| PATCH  | `/appointments/:appointmentId/status` | ✓    | `Pending` → `CheckedIn` → `Completed`, or `Cancelled` |

### Contact

| Method | Path        | Auth        | Body                                                     |
| :----: | ----------- | :---------: | -------------------------------------------------------- |
| POST   | `/contact`  | —           | `{ firstName, lastName, email, phone, message }`         |
| GET    | `/contact`  | ✓ (admin)   | Read all messages                                         |

### Realtime — Socket.io events

| Event           | Direction | Payload                          | Notes                                |
| --------------- | --------- | -------------------------------- | ------------------------------------ |
| `queue:join`    | client → server | `doctorId: string`         | Subscribe to a doctor's queue room   |
| `queue:leave`   | client → server | `doctorId: string`         | Unsubscribe                          |
| `queue:update`  | server → client | `{ type, appointment }`    | Broadcast when an appointment changes |

## How the queue actually works

1. A patient hits `POST /appointments/book`.
2. The `ensureWithinAvailability` middleware checks the doctor's weekly availability for the current weekday and time.
3. The `Appointment` pre-save hook calls `Counter.findOneAndUpdate({ doctorId, date: today }, { $inc: { count: 1 } }, { upsert: true })` — atomic, race-safe.
4. The new `queueNumber` is assigned and the appointment is saved.
5. `emitQueueUpdate(doctorId, …)` broadcasts to everyone in the `queue:<doctorId>` room.
6. The patient's React client (subscribed via `useQueueSocket`) refetches the queue and animates their position.

## Security model

- Passwords are hashed with bcrypt (configurable cost factor).
- Tokens are signed with separate secrets for access/refresh, stored in **httpOnly** cookies (also accepted via `Authorization: Bearer …`).
- Refresh tokens are persisted on the user document and rotated on each refresh — a stolen refresh token gets invalidated when the legitimate user refreshes.
- All inputs run through Zod schemas; all Mongo queries pass through `express-mongo-sanitize`.
- Auth routes are rate-limited (30 req / 15 min). The whole API is rate-limited (200 req / minute).
- Response headers come from `helmet` defaults.

## Roadmap

- Doctor dashboard with queue analytics
- SMS notification on "you're up next" via Twilio (already wired in the original; left as an opt-in)
- Multi-language support (English / Hindi / Kannada)
- Native mobile clients via React Native
- Admin panel for hospital chains

## License

MIT — see [LICENSE](./LICENSE).
