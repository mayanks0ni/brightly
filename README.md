
# Brightly

Brightly is a personal reflection and motivation platform designed to help users capture meaningful moments, revisit them with intention, and transform past experiences into daily motivation and long-term self-awareness.

At its core, Brightly is about memory-driven growth. Instead of generic quotes or surface-level journaling, it uses a user's own memories as the foundation for motivation, reflection, and yearly insights.

---

## Essence of the Project

Most productivity and wellness tools focus on goals, streaks, or external motivation. Brightly takes a different approach:

- Personal memories are treated as the most authentic source of motivation
- Emotional continuity is prioritized over gamification
- Reflection is encouraged without pressure
- Long-term personal narrative matters more than short-term engagement

Brightly is not about doing more.
It is about understanding yourself better through what you have already lived.

---

## What Brightly Does

### Capture Moments
Users store short personal memories — thoughts, events, feelings, or realizations — without worrying about structure or polish.

These memories act as raw emotional signals collected over time.

---

### Memory-Based Daily Motivation
Instead of random motivational quotes, Brightly:
- Analyzes a user’s past memories
- Extracts emotional context and recurring patterns
- Generates short daily motivation grounded strictly in the user’s own experiences

This makes motivation feel personal and emotionally honest.

---

### Yearly Recap and Reflection
Brightly generates an end-of-year recap that:
- Summarizes total memories captured
- Identifies recurring emotional themes
- Highlights peak moments
- Builds a reflective narrative of the year

The recap is designed to feel like a calm personal letter rather than analytics.

---

## Technical Architecture

### Frontend
- Next.js (App Router)
- React
- Tailwind CSS
- Motion-based UI with soft transitions
- Minimal, calm visual design

### Backend
- FastAPI
- Firebase Authentication
- Firestore for structured storage
- Vector database for semantic memory retrieval
- Retrieval-augmented generation pipeline

### Local AI Stack
- Ollama
- LLaMA 3 running fully locally
- No external AI APIs required

All AI-generated content is derived only from user-provided memories.

---

## Running the Project Locally

### Prerequisites

Make sure the following are installed:

- Node.js (v18 or later)
- npm or pnpm
- Python 3.9 or later
- Git
- Firebase project (Firestore + Authentication enabled)

---

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd brightly
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory and add:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Run the frontend:

```bash
npm run dev
```

The frontend will be available at:
`http://localhost:3000`

---

### 3. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` directory:

```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CREDENTIALS_PATH=path_to_service_account.json
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3
```

Start the backend server:

```bash
uvicorn main:app --reload
```

Backend runs on:
`http://127.0.0.1:8000`

---

### 4. Setting Up Ollama and LLaMA 3

Install Ollama:

- macOS:
  Download from https://ollama.com and install

- Linux:
  Follow instructions on the Ollama website

After installation, pull the LLaMA 3 model:

```bash
ollama pull llama3
```

Start Ollama (it usually runs automatically):

```bash
ollama serve
```

Verify it is working:

```bash
ollama run llama3
```

The backend communicates with Ollama locally via:
`http://localhost:11434`

No internet connection is required for AI responses once the model is downloaded.

---

### 5. Vector Database Setup

The project uses a vector database to store embeddings of memories.

Ensure:
- Embeddings are generated only from user memory text
- Metadata includes userId and timestamp
- Retrieval is filtered strictly by user

This ensures privacy and accurate memory grounding.

---

## Design Philosophy

Brightly is built with the following principles:

- Calm over stimulation
- Reflection over reaction
- Narrative over metrics
- Privacy over scale

AI is used as a quiet assistant, not a decision-maker.

---

## Who This Is For

Brightly is for people who:
- Care about reflection but dislike rigid journaling
- Want motivation that feels personal
- Prefer quiet progress
- Value long-term self-understanding

---

## Project Status

Brightly is actively evolving.
The core is intentionally simple to protect its philosophy while allowing future depth.

---

## Final Note

Brightly does not try to optimize you.
It helps you notice patterns you have already lived.

