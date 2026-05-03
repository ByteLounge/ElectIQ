# ElectIQ — Election Process Assistant

ElectIQ is a production-ready, intelligent election process assistant that helps citizens understand elections interactively. It provides real-time voter information, election timelines, and factual news using Gemini 2.0 Flash, Google Civic Information API, and Google Custom Search.

## 🎯 Chosen Vertical: Civic Education & Election Integrity
ElectIQ is designed to bridge the gap between complex government processes and citizen understanding. By focusing on **Civic Education**, the application provides a non-partisan, authoritative, and interactive platform for voters to learn about registration, election timelines, and ballot information.

## 🚀 Features

- **Interactive Chat**: Ask questions about election steps, requirements, and timelines in plain language.
- **Visual Election Timelines**: Explore key phases and typical durations for elections in the US, India, and the UK.
- **Voter Information Lookup**: Find polling locations, registration status, and ballot information.
- **Authoritative News**: Search for recent, factual election news from official government sources.
- **Session Memory**: Secure session-based conversation history powered by Firebase Firestore.

## 🧠 Approach and Logic
ElectIQ uses an **Agentic RAG (Retrieval-Augmented Generation)** architecture. Unlike static chatbots, ElectIQ doesn't just rely on the LLM's training data; it dynamically decides when to fetch live information using specialized tools.

### Core Logic Flow:
1.  **Natural Language Processing:** Gemini 2.0 Flash parses user intent.
2.  **Tool Orchestration:** If a query requires specific data (e.g., "Where do I vote?"), Gemini calls the `lookupVoterInfo` tool.
3.  **Real-time Retrieval:** The backend executes calls to the Google Civic Information API or Google Custom Search.
4.  **Authoritative Synthesis:** Gemini synthesizes the raw API data into a conversational, easy-to-understand response, citing its sources.
5.  **Session Memory:** Firebase Firestore maintains the conversation context, allowing for follow-up questions (e.g., "What about in California?").

## 🛠️ Tech Stack

- **Backend**: Node.js (ESM), Express.js, Google Gemini API (gemini-2.0-flash)
- **Frontend**: React, Vite, Zustand, Vanilla CSS
- **Database**: Firebase Firestore (session management)
- **APIs**: Google Civic Information API, Google Custom Search API
- **Deployment**: Google Cloud Run (Docker)

## 📦 Getting Started

### Prerequisites

- Node.js (v20+)
- Firebase Project & Service Account
- Google AI (Gemini) API Key
- Google Civic Information API Key
- Google Custom Search API Key & Engine ID

### Backend Setup

1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in your API keys.
4. `npm start` (Runs on port 8080)

### Frontend Setup

1. `cd frontend`
2. `npm install`
3. Create a `.env` file with:
   ```
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_CLIENT_API_KEY=your_client_api_key_here
   ```
4. `npm run dev` (Runs on port 5173)

### Using Docker

```bash
docker-compose up --build
```

## 🔐 Evaluation Focus Areas

### 1. Code Quality
- **Modularity:** Separation of concerns between routes, services, and tools.
- **Modern Standards:** Uses ES Modules, Async/Await, and clean directory structures.
- **Maintainability:** Clear JSDoc comments and structured logging via Winston.

### 2. Security
- **Safe Implementation:** Helmet.js for secure headers, CORS protection, and request body size limits.
- **Secret Management:** Strict use of environment variables; no keys are hardcoded or committed.
- **Rate Limiting:** Granular limits for chat (intensive) vs. search (utility) endpoints.
- **Sanitization:** Input cleaning and PII removal.

### 3. Efficiency
- **Gemini 2.0 Flash:** Chosen for its high speed and low latency, ideal for real-time chat.
- **Optimized Assets:** Vite for fast frontend builds and minimal bundle sizes.
- **Firestore:** Efficient document-based storage for rapid session retrieval.

### 4. Testing
- **Backend Validation:** Includes Jest tests for core routes (Chat and Timeline).
- **Manual Verification:** Extensive testing of tool-calling loops and error handling.
- **Reproduction:** Run `cd backend && npm test`.

### 5. Accessibility
- **Semantic HTML:** Use of buttons, headings, and lists for screen reader compatibility.
- **Interactive Feedback:** Loading states and clear error messages.
- **Keyboard Friendly:** Textarea and buttons are navigable via Tab and Enter keys.
- **High Contrast:** Uses a clean, accessible design with clear visual hierarchies.

### 6. Google Services Integration
- **Gemini AI:** Powers the central reasoning and tool-calling engine.
- **Google Civic Information API:** Provides verified polling and registration data.
- **Google Custom Search API:** Fetches the latest election news from specific trusted domains.
- **Firebase Firestore:** Manages secure, scalable session persistence.

## 📝 Assumptions Made
1.  **Authoritative Bias:** We assume government domains (`.gov`, `.nic.in`, `.org.uk`) are the primary authoritative sources for election news.
2.  **Session-Based:** We assume users prefer privacy; thus, data is stored per session and automatically expires after 24 hours.
3.  **US/India/UK Focus:** For the prototype, we prioritized three major democracies with distinct election styles to demonstrate scalability.

---

Built with ❤️ for Civic Education.

## Deployment

This project is configured for automated deployment to Google Cloud Run via GitHub Actions. Pushes to the `main` branch trigger the build and deployment process for both the backend and frontend services.

---
*Last deployment trigger: Sunday, 3 May 2026*
