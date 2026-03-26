# NextRole Security Audit and Deployment Task Plan

## Phase 1: Security Audit and Code Verification
- [x] Run `npm audit` and vulnerability scanners on the React frontend.
- [x] Run `npm audit` and security linting on the Express backend.
- [x] Review code for common security issues (CORS configuration, sensitive data exposure, rate limiting).
- [x] Apply necessary security patches and library updates.

## Phase 2: Microservices & Dockerization (with .env)
- [x] Create `Dockerfile` and `.dockerignore` for the Express backend.
- [x] Configure Backend `.env` support (mapping local versus production env vars like `DB_HOST`, `PORT`).
- [x] Create `Dockerfile` and `.dockerignore` for the React frontend.
- [x] Configure Frontend `.env` build support (injecting `VITE_BACKEND_URI=https://nextrole.maashrees.fr/api` during build).
- [x] Create a local `docker-compose.yml` to test the microservices locally.
- [x] Build Docker images for both frontend and backend.
- [x] Provide commands for the user to push images to Docker Hub.

## Phase 3: Traceability and Logging
- [x] Install logging libraries (e.g., Winston, Morgan) in the backend.
- [x] Configure structured logging for requests and errors.
- [x] Ensure tracking updates are saved into `docs/work_antigravity/` for future reference.

## Phase 4: VPS Deployment and MongoDB Connection
- [x] Create a production `docker-compose.prod.yml` configured for the VPS (using pre-built images or local builds on VPS).
- [x] Update documentation to guide user on how to clone repo to VPS and connect to existing MongoDB container via network or port `27017/tcp`.

## Phase 5: NGINX Reverse Proxy and Domain Setup
- [x] Create NGINX configuration block for `nextrole.maashrees.fr`.
- [x] Configure routing: Serve frontend at `/` or root, and reverse-proxy `/api` to the backend container.
- [x] Provide instructions for configuring DNS records on Hostinger and Let's Encrypt for HTTPS.
