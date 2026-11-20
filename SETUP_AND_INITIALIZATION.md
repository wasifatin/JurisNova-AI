# Setup & Initialization Guide
## JurisNova AI — Local Development & Production Deployment

---

## 1. System Requirements

* **Python:** 3.10 – 3.14
* **Node.js:** v18.0.0+ (Tested on v26)
* **Package Managers:** npm or pnpm
* **Operating Systems:** Windows 10/11, macOS, Ubuntu / Debian Linux

---

## 2. Local Environment Setup

### 2.1 Backend Initialization
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\activate
# Linux / macOS:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env
```

### 2.2 Configure `.env`
Edit `backend/.env`:
```ini
PROJECT_NAME="JurisNova AI"
ENVIRONMENT="development"
DEBUG=True
SECRET_KEY="your-jwt-secret-key"
DATABASE_URL="sqlite:///./jurisnova.db"
DEMO_MODE=True
# Optional cloud AI keys:
GEMINI_API_KEY=""
OPENAI_API_KEY=""
```

### 2.3 Initialize & Seed Database
```bash
# Set PYTHONPATH to backend directory
# Windows (PowerShell):
$env:PYTHONPATH="."
# Linux / macOS:
export PYTHONPATH="."

# Execute database migration and seeding
python app/db/seed.py
```
*Output should confirm: `[SUCCESS] Database successfully seeded with enterprise GRC data!`*

### 2.4 Start Backend Server
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
* **API Server:** `http://localhost:8000`
* **Interactive API Documentation:** `http://localhost:8000/docs`
* **Health Check:** `http://localhost:8000/health`

---

## 3. Frontend Initialization

In a separate terminal:
```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Run Next.js development server
npm run dev
```
* **Frontend Web App:** `http://localhost:3000`

---

## 4. Production Deployment

### 4.1 Frontend Deployment (Vercel)
1. Push repository to GitHub.
2. In Vercel, import the repository and set the **Root Directory** to `frontend`.
3. Configure Environment Variable:
   * `NEXT_PUBLIC_API_URL`: URL of your deployed backend (e.g., `https://api.jurisnova.ai/api/v1`).
4. Click **Deploy**.

### 4.2 Backend Deployment (Render / Docker)
A standard `Dockerfile` for the backend:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```
Deploy on Render or Railway setting `PORT=8000` and attaching a managed PostgreSQL instance with `pgvector`.
