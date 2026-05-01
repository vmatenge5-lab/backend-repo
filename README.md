# Student Directory – Backend API
## INFS 202 Midterm Backend Project

---

## Project Description
A RESTful backend API for the Student Directory application. Built with Node.js and Express, backed by a PostgreSQL database. Includes JWT-based authentication and full CRUD for student records.

## Tech Stack
| Layer        | Technology           |
|-------------|----------------------|
| Runtime      | Node.js 18+          |
| Framework    | Express 4            |
| Database     | lowdb (JSON file)    |
| Auth         | JWT + bcryptjs       |
| Deployment   | Railway / any Node host |

---

## API Endpoints

### Auth (public)
| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| POST   | /api/auth/register    | Create an account  |
| POST   | /api/auth/login       | Login, get JWT     |

### Students (JWT required)
| Method | Endpoint              | Description                      |
|--------|-----------------------|----------------------------------|
| GET    | /api/students         | List all (supports ?search=&major=&year=) |
| GET    | /api/students/:id     | Get one student                  |
| POST   | /api/students         | Add new student                  |
| PUT    | /api/students/:id     | Update student                   |
| DELETE | /api/students/:id     | Delete student                   |

### Majors (public)
| Method | Endpoint   | Description       |
|--------|------------|-------------------|
| GET    | /api/majors | List all majors  |

### Other
| Method | Endpoint  | Description    |
|--------|-----------|----------------|
| GET    | /health   | Health check   |
| GET    | /         | API info       |

---

## Database Schema

```sql
users      — id, username, email, password (hashed), role, created_at
majors     — id, name
students   — id, student_id, name, email, phone, major_id (FK), year, gpa, bio, avatar, color, created_at
```

---

## Local Setup

### 1. Clone and install
```bash
cd student-backend
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Edit .env and fill in:
# DATABASE_URL=postgresql://user:pass@localhost:5432/student_db
# JWT_SECRET=some_long_random_string
```

### 3. Set up local PostgreSQL (if testing locally)
```bash
# Create DB
psql -U postgres -c "CREATE DATABASE student_db;"

# Run schema (creates tables + seeds data)
psql -U postgres -d student_db -f sql/schema.sql
```

### 4. Run the server
```bash
npm run dev       # development (nodemon auto-reload)
npm start         # production
```
Server runs on http://localhost:3000

---

## Deployment on Railway (Step-by-Step)

### Step 1 – Push code to GitHub
```bash
# In student-backend folder
git init
git add .
git commit -m "Initial backend"
git remote add origin https://github.com/YOUR_USERNAME/student-backend.git
git push -u origin main
```

### Step 2 – Create Railway project
1. Go to https://railway.app and sign up/log in
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your `student-backend` repository
4. Railway auto-detects Node.js and starts building

### Step 3 – Add PostgreSQL database
1. In your Railway project, click **+ New** → **Database** → **PostgreSQL**
2. Railway creates the database and links it automatically
3. Click the PostgreSQL service → **Variables** tab → copy `DATABASE_URL`

### Step 4 – Set environment variables
In your backend service → **Variables** tab, add:
```
DATABASE_URL   = (auto-linked from Railway PostgreSQL)
JWT_SECRET     = your_long_random_secret_here_make_it_at_least_32_chars
NODE_ENV       = production
FRONTEND_URL   = https://your-frontend.up.railway.app
```

### Step 5 – Run the SQL schema (first time only)
1. In Railway, click the PostgreSQL service → **Connect** tab
2. Open the **Query** panel (or use the psql command shown)
3. Paste and run the contents of `sql/schema.sql`

### Step 6 – Get your live backend URL
1. In your backend service → **Settings** → **Networking** → **Generate Domain**
2. Your API is now live at: `https://student-backend-xxxx.up.railway.app`

---

## Deploying the Frontend on Railway

### Step 1 – Push frontend to GitHub
```bash
cd student-directory
git init
git add .
git commit -m "Initial frontend"
git remote add origin https://github.com/YOUR_USERNAME/student-directory.git
git push -u origin main
```

### Step 2 – Create another Railway service
1. In the same Railway project, click **+ New** → **GitHub Repo**
2. Select your `student-directory` repo

### Step 3 – Set frontend environment variable
In the frontend service → **Variables**:
```
VITE_API_URL = https://student-backend-xxxx.up.railway.app
```

### Step 4 – Generate frontend domain
Settings → Networking → Generate Domain

### Step 5 – Update backend CORS
Go back to the backend service → Variables, update:
```
FRONTEND_URL = https://student-frontend-xxxx.up.railway.app
```
Then redeploy the backend (it picks up the new variable automatically).

---

## Testing the API with curl

```bash
# Register
curl -X POST https://YOUR-BACKEND.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@test.com","password":"secret123"}'

# Login (copy the token from the response)
curl -X POST https://YOUR-BACKEND.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"secret123"}'

# List students (replace TOKEN)
curl https://YOUR-BACKEND.up.railway.app/api/students \
  -H "Authorization: Bearer TOKEN"
```

---

## Live URLs
- **Backend API:** https://student-backend-xxxx.up.railway.app  ← update after deploying
- **Frontend App:** https://student-frontend-xxxx.up.railway.app ← update after deploying
