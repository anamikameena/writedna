# WriteDNA — Academic Integrity System

AI-powered writing fingerprint analysis to detect submission inconsistencies.

## Tech Stack
- **Frontend**: React, React Router, Recharts
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Analysis**: Custom NLP fingerprinting (no paid APIs needed)

## Project Structure
```
writedna/
├── client/               # React frontend (port 3000)
│   └── src/
│       ├── components/   # Sidebar, RiskBadge
│       ├── pages/        # Dashboard, Students, StudentProfile, Submissions, SubmissionDetail, Submit
│       └── services/     # axios API layer
├── server/               # Node/Express backend (port 5000)
│   ├── models/           # Student.js, Submission.js
│   ├── routes/           # students.js, submissions.js, dashboard.js
│   └── services/         # fingerprintService.js (core analysis logic)
└── package.json          # root scripts
```

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally (`mongod`) OR MongoDB Atlas (free tier)

### 2. Clone & Install
```bash
# Install all dependencies (root + server + client)
npm run install-all
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env with your MongoDB URI
```

If using local MongoDB: `MONGO_URI=mongodb://localhost:27017/writedna`
If using MongoDB Atlas: paste your connection string.

### 4. Run the App
```bash
npm run dev
```
This starts both the backend (port 5000) and frontend (port 3000) simultaneously.

Open **http://localhost:3000**

---

## How It Works

### Writing Fingerprint
Each student profile stores a rolling fingerprint built from all their past submissions:
- Average word length
- Average sentence length
- Vocabulary richness (unique words / total words)
- Punctuation frequency
- Sentence complexity (clause markers per sentence)
- Passive voice ratio
- Top 10 content words

### Deviation Score (0–100)
When a new submission is uploaded:
1. Features are extracted from the text
2. Each feature is compared against the student's fingerprint
3. A weighted deviation score is calculated
4. Risk level is assigned: **Normal** (<35), **Suspicious** (35–60), **High Risk** (>60)

> Note: The first submission builds the baseline fingerprint and is always marked Normal.
> Meaningful analysis begins from the 2nd submission onward.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Summary stats + recent submissions |
| GET | `/api/students` | All students |
| POST | `/api/students` | Create student |
| GET | `/api/students/:id` | Student + their submissions |
| DELETE | `/api/students/:id` | Delete student |
| GET | `/api/submissions` | All submissions |
| POST | `/api/submissions` | Analyze new submission |
| GET | `/api/submissions/:id` | Submission detail |
| DELETE | `/api/submissions/:id` | Delete submission |
