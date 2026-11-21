# HealthMate - AI-Powered Healthcare Companion

[![CI - Pull Request Validation](https://github.com/Talhah2005/HealthCare/actions/workflows/ci.yml/badge.svg)](https://github.com/Talhah2005/HealthCare/actions/workflows/ci.yml)
[![CD - Deploy HealthMate](https://github.com/Talhah2005/HealthCare/actions/workflows/deploy.yml/badge.svg)](https://github.com/Talhah2005/HealthCare/actions/workflows/deploy.yml)

**HealthMate** is a full-stack healthcare companion for securely storing medical reports, tracking health vitals, generating AI-assisted report summaries, and maintaining a question-and-answer conversation for each report.

The project uses a React frontend, an Express REST API, MongoDB, Google Gemini, Cloudinary, and containerized deployments. It is designed as a Docker-first application and can be run locally with Docker Compose or deployed automatically to a VPS through GitHub Actions.

> **Medical disclaimer:** HealthMate is an informational project, not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Development Scope](#development-scope)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Repository Structure](#repository-structure)
- [API Overview](#api-overview)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Docker Development](#docker-development)
- [Production Deployment](#production-deployment)
- [CI/CD](#cicd)
- [Security and Privacy](#security-and-privacy)
- [Testing and Validation](#testing-and-validation)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Project Overview

HealthMate combines three practical healthcare workflows:

1. **Medical record management** - upload and classify reports such as lab reports, X-rays, MRI, CT, ultrasound, ECG, and prescriptions.
2. **Health tracking** - record and review personal vitals including blood pressure and other measurements.
3. **AI-assisted understanding** - extract report text, create English and Urdu summaries, identify abnormal values, and provide conversational answers about a report.

The platform is intended for users who want one accessible timeline for documents and measurements rather than several disconnected applications or paper records.

## Development Scope

### Frontend Development

The frontend is a React 19 single-page application created with Vite 7.

- **React Router** provides protected dashboard routes and navigation.
- **Authentication context** stores the JWT and restores a user session through `/api/auth/me`.
- **Axios** communicates with the Express API.
- **Tailwind CSS 4** and utility libraries provide responsive styling.
- **React Toastify** displays login, upload, and operation feedback.
- **Vite** supplies local development server and production builds.
- **Nginx** serves the built static files and proxies `/api` requests to the backend.

The frontend contains pages for login, registration, dashboard, report upload, report viewing, vital entry, and medical timeline management.

### Backend Development

The backend is an Express 5 REST API written in ES modules and running on Node.js 20.

The implementation follows a route-controller-model structure:

- `routes/` maps HTTP endpoints to controller functions.
- `controllers/` handles request validation, business logic, and responses.
- `models/` defines MongoDB documents with Mongoose.
- `middleware/` enforces authentication and centralized error handling.
- `services/` contains Gemini-related AI behavior.
- `config/` contains database, upload, and external-service configuration.

Major backend responsibilities include:

- JWT registration and login
- Protected API routes
- Password hashing with bcrypt
- Medical report upload and metadata storage
- MongoDB-backed report, user, vital, and conversation data
- OCR/document processing for uploaded files
- Google Gemini report analysis
- Cloudinary file hosting
- Report-specific AI conversation history
- Health and application status endpoints

### Database and Data Models

MongoDB is the primary database. Mongoose models currently cover:

| Model | Purpose |
|---|---|
| `User` | Account details and authentication data |
| `Report` | Report metadata, Cloudinary file reference, and AI analysis |
| `Vital` | User health measurements |
| `Conversation` | AI questions and answers associated with a report |

Report data stores English and Urdu summaries, severity and urgency classifications, abnormal and normal values, doctor questions, dietary suggestions, home remedies, recommendations, and analysis timestamps.

### AI and Document Processing

Uploaded reports may be processed using a combination of:

- Google Generative AI / Gemini
- Google Cloud Vision
- Tesseract.js OCR
- PDF parsing
- Multer for multipart uploads
- Cloudinary for storage

The report workflow can extract text from a document and create structured, user-friendly analysis. AI responses must be treated as informational assistance and not as clinical diagnosis.

## Key Features

- User registration and login
- JWT authentication and protected frontend/backend routes
- Secure password hashing
- Medical report upload for PDF and image files
- Report categorization and report date tracking
- Cloud-backed report file storage
- AI-generated report summary in English and Urdu
- Severity and urgency information
- Abnormal and normal value extraction
- Suggested doctor questions and general recommendations
- Report-specific AI assistant conversations
- Blood pressure and other vital tracking
- Personal medical timeline
- Application health endpoint
- Dockerized frontend, backend, and database

## Technology Stack

### Frontend

- React 19
- Vite 7
- React Router 7
- Axios
- Tailwind CSS 4
- React Toastify
- Lucide React
- Nginx

### Backend

- Node.js 20
- Express 5
- MongoDB 8
- Mongoose 8
- JSON Web Tokens
- bcrypt / bcryptjs
- Multer
- express-validator
- Google Generative AI
- Google Cloud Vision
- Tesseract.js
- PDF parsing
- Cloudinary

### DevOps and Infrastructure

- Docker
- Docker Compose
- Docker Hub
- GitHub Actions CI/CD
- GitHub-hosted runners
- Linux VPS
- Nginx reverse proxy
- DuckDNS hostname
- SSH deployment
- Docker health checks
- Persistent Docker volumes

## Architecture

```text
Browser
  |
  | HTTP / HTTPS
  v
Nginx frontend container (:80)
  |                        \
  | static React assets     | /api/* reverse proxy
  v                        v
Built React SPA          Express backend (:5000)
                                  |
               +------------------+-------------------+
               |                  |                   |
               v                  v                   v
          MongoDB 8           Cloudinary        Gemini / OCR
        (persistent             files       external AI/text services
         volume)
```

Docker Compose provides three application services:

- `mongo` - MongoDB with an authenticated administrator account and persistent `mongo-data` volume.
- `backend` - Express API built from `HealthCare-Backend/Dockerfile`.
- `frontend` - React production build served by Nginx, also proxying `/api/` to the backend.

Both application containers join the `frontend-network`; the backend and MongoDB join the `backend-network`. MongoDB is not published to the host in `docker-compose.yaml`, limiting direct external access.

## Repository Structure

```text
HealthCare/
├── .github/workflows/
│   ├── ci.yml                 # Pull-request build validation
│   └── deploy.yml             # Docker image build and VPS deployment
├── HealthCare-Backend/
│   ├── config/                # Database, Multer, and service configuration
│   ├── controllers/           # Authentication, reports, vitals, assistant logic
│   ├── middleware/            # JWT authentication and error handling
│   ├── models/                # Mongoose schemas
│   ├── routes/                # REST route definitions
│   ├── services/              # Gemini AI integration
│   ├── utils/                 # Shared backend utilities
│   ├── Dockerfile             # Node.js production image
│   ├── index.js               # Express application entry point
│   ├── package.json
│   └── vercel.json            # Optional Vercel serverless configuration
├── HealthCare-Frontend/
│   ├── public/                # Static public assets
│   ├── src/
│   │   ├── components/        # Shared and protected-route components
│   │   ├── context/           # Authentication context
│   │   ├── pages/             # Login, dashboard, report, timeline pages
│   │   ├── config/            # API configuration
│   │   └── lib/               # Frontend utilities
│   ├── Dockerfile             # Multi-stage Vite build and Nginx image
│   ├── nginx.conf             # Static SPA and API proxy configuration
│   └── package.json
├── docker-compose.yaml         # Local and VPS application stack
└── README.md
```

## API Overview

The backend is mounted under `/api`.

| Area | Endpoints | Authentication |
|---|---|---|
| Authentication | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` | Public register/login; protected `/me` |
| Reports | `POST /api/reports/upload`, `GET /api/reports`, `GET /api/reports/:id`, `DELETE /api/reports/:id` | JWT required |
| Vitals | `POST /api/vitals`, `GET /api/vitals`, `GET /api/vitals/:id`, `GET /api/vitals/health-tips`, `DELETE /api/vitals/:id` | JWT required |
| AI Assistant | `POST /api/assistant/ask`, `GET /api/assistant/conversation/:reportId`, `DELETE /api/assistant/conversation/:reportId` | JWT required |
| Application | `GET /`, `GET /api/health` | Public |

Protected requests send the bearer token through the frontend Axios configuration.

Example:

```bash
curl -H "Authorization: Bearer YOUR_JWT" \
  https://healthmate-talha.duckdns.org/api/reports
```

## Environment Variables

Create the backend environment file at:

```text
HealthCare-Backend/.env
```

Add the variables used by your deployment:

```dotenv
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthmate
FRONTEND_URL=http://localhost:8080
CLIENT_URL=http://localhost:5173

JWT_SECRET=replace-with-a-long-random-secret

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

GEMINI_API_KEY=your-google-gemini-api-key
GOOGLE_APPLICATION_CREDENTIALS=/path/to/google-service-account.json
```

Docker Compose also expects these variables at repository root or in the shell environment:

```dotenv
MONGO_ROOT_USERNAME=healthmate-admin
MONGO_ROOT_PASSWORD=replace-with-a-strong-password
MONGO_DATABASE=healthmate
```

> **Never commit real secrets, service-account credentials, API keys, or `.env` files.** Use `.gitignore` and GitHub Actions secrets for production values.

## Local Development

### Requirements

- Node.js 20 or newer
- npm
- MongoDB, or Docker Desktop / Docker Engine
- Cloudinary account for file uploads
- Google Gemini credentials/API key for AI features

### 1. Clone the repository

```bash
git clone https://github.com/Talhah2005/HealthCare.git
cd HealthCare
```

### 2. Configure the backend

```bash
cp HealthCare-Backend/.env.example HealthCare-Backend/.env
```

Set at least `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, and the external-service credentials required for report processing.

### 3. Start MongoDB

Use a local MongoDB instance or run only MongoDB with Docker:

```bash
docker run --name healthmate-mongo \
  -e MONGO_INITDB_ROOT_USERNAME=healthmate-admin \
  -e MONGO_INITDB_ROOT_PASSWORD=change-me \
  -p 27017:27017 \
  -v healthmate-mongo:/data/db \
  -d mongo:8.0
```

### 4. Start the backend

```bash
cd HealthCare-Backend
npm ci
npm run dev
```

The API listens on `http://localhost:5000` by default.

### 5. Start the frontend

Open another terminal:

```bash
cd HealthCare-Frontend
npm ci
npm run dev
```

Vite typically serves the application at `http://localhost:5173`.

Frontend API configuration should point to `http://localhost:5000/api` during independent local development.

## Docker Development

Docker Compose is the recommended integrated setup.

### Create a root `.env` file

```dotenv
MONGO_ROOT_USERNAME=healthmate-admin
MONGO_ROOT_PASSWORD=replace-with-a-strong-password
MONGO_DATABASE=healthmate
```

Ensure `HealthCare-Backend/.env` exists. At minimum, configure production-facing or external-service values needed by the backend.

### Build and start all services

```bash
docker compose up --build -d
```

Open:

```text
http://localhost:8080
```

Useful Docker commands:

```bash
# View running services
docker compose ps

# Follow all logs
docker compose logs -f

# Follow backend logs
docker compose logs -f backend

# Restart the stack
docker compose restart

# Stop containers while preserving the named volume
docker compose down

# Stop containers and delete MongoDB data
docker compose down -v
```

### Container health

The MongoDB health check authenticates and executes `db.adminCommand('ping')`.

The backend health check calls:

```text
http://localhost:5000/api/health
```

The Compose stack uses `depends_on` conditions so the backend starts after MongoDB is healthy and the frontend starts after the backend is healthy.

### Docker Compose networking

```text
frontend-network:
  frontend + backend

backend-network:
  backend + mongo
```

This separation exposes only the frontend on host port `8080`; MongoDB remains reachable only inside the Compose network.

## Production Deployment

The repository is configured for deployment to a Linux VPS with Docker Compose and Docker Hub.

A production deployment must provide:

- Docker and Docker Compose Plugin
- SSH access using an ED25519 key
- A directory such as `/opt/healthmate`
- A production Compose file
- Docker Hub credentials
- `MONGO_ROOT_USERNAME`, `MONGO_ROOT_PASSWORD`, and `MONGO_DATABASE`
- Backend secrets at `/opt/healthmate/HealthCare-Backend/.env`
- A domain or DuckDNS hostname
- Firewall rules allowing ports 80 and 443
- HTTPS/TLS if exposed publicly

### VPS preparation example

```bash
sudo mkdir -p /opt/healthmate
sudo chown -R "$USER":"$USER" /opt/healthmate
cd /opt/healthmate
```

Install Docker and Compose, then configure the production environment:

```bash
cp .env.example .env
chmod 600 .env
```

Upload or generate the backend environment file:

```bash
mkdir -p HealthCare-Backend
nano HealthCare-Backend/.env
chmod 600 HealthCare-Backend/.env
```

Pull and recreate the services:

```bash
export IMAGE_TAG=latest
docker compose pull
docker compose up -d --remove-orphans
docker compose ps
```

The live health endpoint is expected to be:

```text
https://healthmate-talha.duckdns.org/api/health
```

### VPS deployment considerations

- Use a reverse proxy or TLS termination for HTTPS.
- Configure the backend `FRONTEND_URL` with the final public frontend origin.
- Add firewall rules and secure MongoDB credentials.
- Back up the `mongo-data` volume regularly.
- Keep Docker, the OS, and Nginx/host proxy packages updated.
- Use log rotation and monitor disk usage.
- Restrict SSH access to keys and disable password login when practical.
- Avoid storing the private deployment key in the repository.

## CI/CD

### Continuous Integration

`.github/workflows/ci.yml` runs for pull requests targeting `main`.

The validation workflow:

1. Checks out the repository.
2. Configures Node.js 20 and npm caches.
3. Runs `npm ci` for the backend.
4. Checks backend entry-point syntax with `node --check index.js`.
5. Runs `npm ci` for the frontend.
6. Builds the Vite frontend.
7. Builds both Dockerfiles.

This detects dependency, syntax, frontend build, and Docker build failures before merging.

### Continuous Deployment

`.github/workflows/deploy.yml` runs on pushes to `main`.

The deployment workflow:

1. Checks out the repository.
2. Configures Docker Buildx.
3. Logs in to Docker Hub.
4. Builds and pushes backend and frontend images.
5. Tags images with `latest` and the Git commit SHA.
6. Uses GitHub Actions cache for Docker layers.
7. Configures SSH access to the VPS.
8. Pulls images and recreates containers in `/opt/healthmate`.
9. Calls the production `/api/health` endpoint repeatedly for verification.

### Required GitHub Secrets

Configure these repository secrets:

| Secret | Purpose |
|---|---|
| `DOCKERHUB_USERNAME` | Docker Hub login |
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `VPS_SSH_KEY` | Private SSH key used by GitHub Actions |
| `VPS_HOST` | VPS hostname or IP address |
| `VPS_USER` | SSH account used for deployment |

Configure backend secrets outside the repository on the VPS or through a secure deployment secret mechanism.

### Rollback Strategy

Each Docker image is also tagged with the commit SHA. To roll back manually:

```bash
export IMAGE_TAG=<known-good-commit-sha>
docker compose pull
docker compose up -d --remove-orphans
curl --fail https://healthmate-talha.duckdns.org/api/health
```

MongoDB schema/data migrations should be reviewed before a rollback because application rollback alone does not reverse database changes.

## Security and Privacy

The project contains several security-oriented features:

- JWT protected API endpoints
- Password hashing before database storage
- Backend validation for authentication input
- Docker network separation
- MongoDB authentication
- Dockerized production dependencies
- 15 MB Nginx upload limit
- CORS configuration
- Centralized backend error handling
- GitHub Actions secrets for deployment credentials
- Persistent database volume for MongoDB

Recommended improvements for handling healthcare data:

- Enable HTTPS everywhere
- Use a secrets manager
- Add rate limiting and account lockout protection
- Enforce stronger passwords
- Add refresh tokens or short-lived access tokens
- Encrypt backups
- Add audit logs and retention policies
- Restrict access to uploaded report storage
- Add consent, deletion, export, and privacy workflows
- Add security headers through Nginx
- Add automated dependency and container vulnerability scans
- Add a formal HIPAA/GDPR compliance assessment if legally required

## Testing and Validation

Current CI validates:

- Backend JavaScript syntax
- Frontend dependency installation
- Frontend production build
- Backend Docker image build
- Frontend Docker image build

For more complete coverage, add:

```bash
# Frontend lint
cd HealthCare-Frontend
npm run lint

# Frontend production build
npm run build

# Backend syntax check
cd ../HealthCare-Backend
node --check index.js

# Docker stack validation
cd ..
docker compose config
```

A production-ready test suite should include unit, integration, and API tests for authentication, authorization, reports, vitals, AI endpoints, database behavior, and container startup.

## Troubleshooting

### Backend cannot connect to MongoDB

Check `MONGO_ROOT_USERNAME`, `MONGO_ROOT_PASSWORD`, `MONGO_DATABASE`, and `MONGODB_URI`.

For Docker Compose, MongoDB is available at:

```text
mongo:27017
```

### Frontend cannot reach the backend

Verify the Nginx `/api/` proxy and container names in `nginx.conf`.

```bash
docker compose logs frontend
docker compose logs backend
curl http://localhost:8080/api/health
```

### Unauthorized API responses

Confirm that the login response contains a JWT and that the frontend stores it in `localStorage`. Check that `Authorization: Bearer <token>` is sent to protected endpoints.

### Report upload fails

Check:

- Nginx `client_max_body_size`
- Cloudinary credentials
- File field name: `file`
- File size and format
- Backend logs

The Nginx upload limit is currently 15 MB.

### AI analysis is unavailable

Verify the Gemini API key and Google service configuration. Also check provider quotas and network access from the backend container.

### Container is unhealthy

```bash
docker compose ps
docker inspect <container-name>
docker compose logs -f
```

For the backend, test:

```bash
curl http://localhost:8080/api/health
```

### Deployment verification fails

Confirm:

- VPS SSH secrets
- `/opt/healthmate` exists
- Docker Compose is available on the VPS
- Docker Hub images are accessible
- The VPS can reach DuckDNS/HTTPS health URL
- Firewall ports are open

## Future Improvements

- Add automated unit and integration test suites
- Add SAST, dependency scanning, and container vulnerability scanning
- Add staging and production environments
- Add Blue-Green or rolling deployments
- Add centralized logging and metrics
- Add monitoring, alerting, uptime checks, and backups
- Add database migration tooling
- Add Redis caching or queue workers for AI processing
- Move AI report jobs to asynchronous processing
- Add report sharing and audit history
- Add multi-factor authentication
- Add role-based access control
- Add automatic report cleanup and data retention controls
- Add full HTTPS and security-header configuration
- Improve accessibility and mobile experience
- Add end-to-end browser tests

## License

No license file is currently included in this repository. A license should be added before redistribution or reuse in an open-source context.

---

## Quick Start Summary

```bash
# Clone
git clone https://github.com/Talhah2005/HealthCare.git
cd HealthCare

# Configure environment
cp HealthCare-Backend/.env.example HealthCare-Backend/.env

# Run the complete Docker stack
docker compose up --build -d

# Open the application
open http://localhost:8080

# Verify services
docker compose ps
curl --fail http://localhost:8080/api/health
```
