# CyberSentinel – Authentication setup

## Current status: local demo accounts
`AUTH_CONFIG.mode = 'local'` (top of the auth script in `index.html`).

- Accounts live in this browser's `localStorage` (`cs_users`). Passwords are stored only as salted PBKDF2-SHA256 hashes (150,000 iterations); plain-text passwords are never saved.
- Sessions: `cs_session` in `sessionStorage` (12 h), or `localStorage` (30 days) with "Remember me". No password or hash is stored in the session.
- Progress is stored per account under `cq2:<userId>`. Progress saved before accounts existed (`cq2`) is moved into the first account that logs in.
- 5 failed logins lock the form for 30 seconds (per browser tab).
- **Limitation:** with no server, anyone with access to the device and the browser's developer tools can read or edit local data and skip the login screen. Treat this as a demo, not as secure authentication.

## Enabling real accounts
1. Deploy an auth backend that exposes (JSON, same origin or CORS with credentials):
   - `POST /auth/register` body `{username, password}` → `200 {user:{id,name}}` or `4xx {error}`
   - `POST /auth/login` body `{username, password}` → `200 {user:{id,name}}` or `401 {error}`
   - `POST /auth/logout` → `204`
   Use an httpOnly, Secure, SameSite session cookie; hash passwords server-side (argon2id/bcrypt); rate-limit login.
   Good options: Supabase Auth, Firebase Authentication (via a small proxy), or your own Node/Python API.
2. In `index.html` set:
   ```js
   const AUTH_CONFIG={mode:'remote',apiBase:'https://your-api.example.com', ...}
   ```
3. Never put secret keys in the frontend. Only public client keys (e.g. a Supabase anon key) may be exposed.
4. To sync progress and real leaderboards, add endpoints such as `GET/PUT /progress` and `GET /leaderboard`, and call them where `save()` writes `localStorage`.

## Static hosting
Everything except real accounts works on GitHub Pages or any static host: upload `index.html`.
