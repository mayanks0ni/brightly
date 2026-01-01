# Brightly

Brightly is a personal reflection and motivation platform that helps users capture meaningful moments, reflect on them over time, and transform past experiences into grounded motivation and long-term self-awareness.

Unlike traditional journaling or quote-based motivation apps, Brightly uses **a user’s own memories as the only source of insight**.

---

## What Makes Brightly Different

Most wellness and productivity tools rely on:

* streaks
* goals
* external motivation

Brightly focuses instead on:

* memory-driven reflection
* emotional continuity over time
* zero pressure to perform or “be consistent”
* narrative understanding rather than metrics

Brightly is not about doing more.
It is about understanding yourself better through what you have already lived.

---

## Core Features

### 1. Memory Capture

Users store short personal memories — thoughts, events, feelings, or realizations — without any enforced structure.

These memories become the **raw emotional data** of the system.

---

### 2. Memory-Based Motivation

Instead of random quotes, Brightly:

* retrieves relevant past memories
* analyzes emotional tone and recurring themes
* generates short motivational reflections grounded strictly in user history

Motivation is always **personal, contextual, and honest**.

---

### 3. Yearly Recap

Brightly generates a year-end recap that:

* summarizes memories captured
* detects recurring emotional patterns
* highlights meaningful moments
* presents insights as a calm narrative, not analytics

The recap is designed to feel like a **personal letter to yourself**.

---

## Tech Stack (As Implemented)

### Frontend

* Next.js (App Router)
* React
* Tailwind CSS
* Framer Motion
* Firebase Authentication
* Firestore

### Backend

* FastAPI
* Python
* Firebase Admin SDK
* Vector embeddings + semantic retrieval
* Retrieval-Augmented Generation (RAG)

### AI Layer

* Gemini (via `google.genai`) **or**
* Local LLMs (Ollama) depending on configuration

AI responses are generated **only from user memories**.

---

## Project Structure

```text
brightly/
│
├── backend/
│   ├── app/
│   │   ├── ai/            # LLM + prompting logic
│   │   ├── api/           # FastAPI routes
│   │   ├── core/          # app startup & config
│   │   ├── db/            # firestore / vector db logic
│   │   ├── schemas/       # pydantic models
│   │   ├── services/      # business logic
│   │   ├── utils/
│   │   └── main.py        # FastAPI entrypoint
│   ├── requirements.txt
│   ├── credentials.json   # Get it from Firebase Console (Project Settings → Service Accounts, Generate new private key, a file will be downloaded, rename it to credentials.json)
│   └── .env.example
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── types/
│   ├── public/
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## Running the Project Locally

### Prerequisites

Make sure you have:

* Node.js **18+**
* npm or pnpm
* Python **3.10+** (recommended)
* Git
* Firebase project (Auth + Firestore enabled)
* Pinecone Index

perfect — here’s a **short, clean, README-ready version**.
no fluff, no over-explaining, just what a user needs.

---

## LLM Provider

Brightly supports **Gemini** and **local LLMs (Ollama)**.
By default, it uses **Gemini**.

Configure in `backend/app/.env` while configuring backend environment variables:

```env
LLM_PROVIDER=gemini   # gemini | local
```

**Gemini (default):**

```env
GEMINI_MODEL=gemini-2.5-flash
```

**Local (Ollama):**

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3
```

If `LLM_PROVIDER` is not set, Gemini is used automatically.

---

## Pinecone Setup

Brightly uses Pinecone to store vector embeddings of user memories.

### 1. Create Account & API Key

1. Go to [https://www.pinecone.io](https://www.pinecone.io) and sign in
2. Open **API Keys** → **Create API Key**
3. Copy the key
4. This key will be later used while configuring the environment variables of the backend.

---

### 2. Create Index

In **Indexes → Create Index**, use:

* **Name**: `brightly-memories`
* **Dimensions**: `768`
* **Metric**: `cosine`
  
---

## 1. Clone the Repository

```bash
git clone https://github.com/mayanks0ni/brightly.git
cd brightly
```

---

## 2. Frontend Setup

Step 1: Install Dependencies
```bash
cd frontend
npm install
```
Step 2: Environment Variables

```bash
cp .env.example .env.local
```
Add
- Firebase Config
- Backend API Base URL

Step 3: Run frontend
```bash
npm run dev
```

Frontend runs at:

```
http://localhost:3000
```

---

## 3. Backend Setup (FastAPI)
Step 1: Create a Virtual Environment
```bash
cd backend
python -m venv venv
source venv/bin/activate
```
Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```
Step 3: Environment Variables
```bash
cp app/.env.example app/.env
```
Fill in required values such as:
- AI API keys (Gemini / local model config)
- Firebase Config & Pinecone API Key

Step 4: Run Backend Server

```bash
uvicorn app.main:app --reload
```

Backend will be available at:

```
http://127.0.0.1:8000
```

---

## 4. Optional: Ollama + Local LLM Setup

If using local models instead of Gemini:

Install Ollama
[https://ollama.com](https://ollama.com)

Pull model:

```bash
ollama pull llama3
```

Start Ollama:

```bash
ollama serve
```

Verify:

```bash
ollama run llama3
```

Backend communicates locally at:

```
http://localhost:11434
```

---

## 5. Vector Memory Storage

* Each memory is embedded at write time
* Stored with `userId` and timestamp
* Retrieval is strictly user-scoped
* AI never sees global or shared data

This ensures **privacy and grounding**.

---

## Design Philosophy

* Calm over stimulation
* Reflection over reaction
* Narrative over metrics
* Privacy over scale

AI is a quiet assistant — not an optimizer or judge.

---

## Who This Is For

Brightly is for people who:

* want reflection without rigidity
* dislike streaks and pressure
* value emotional continuity
* prefer personal insight over productivity hacks

---

## Project Status

Brightly is actively evolving.
The foundation is intentionally minimal to protect its philosophy.

---

## Final Note

Brightly does not try to optimize you.
It helps you notice patterns you have already lived.
