# Branches Prototype

An interactive prototype exploring branching conversations with context inheritance and bidirectional propagation — a reimagining of Claude Projects.

## What is this?

Branches lets you break complex projects into parallel workstreams (branches) that inherit context from a shared trunk. Decisions made in any branch can be propagated back up to the project level, keeping all workstreams in sync.

The prototype includes two pre-populated example projects:
- **European Family Vacation** — planning a 3-week Italy trip across multiple legs
- **Contextual Onboarding** — product launch with research, competitive analysis, spec, and GTM branches

## Features

- **Context inheritance** — branches automatically receive all project-level context
- **Bidirectional propagation** — save decisions from branches back to the project trunk
- **Multi-project support** — switch between projects or create new ones
- **Chat & Cowork modes** — Cowork mode enables web search and document creation (PPTX, XLSX, DOCX, PDF)
- **Interactive Cowork suggestions** — Claude suggests switching to Cowork mode when live data would help
- **Clickable URLs** — links in responses open with a confirmation dialog
- **Text selection propagation** — select any text in a response to save it to the project

## Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/skyelaudari/branches-prototype.git
   cd branches-prototype
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Add your API keys to `.env`:
   - `ANTHROPIC_API_KEY` — get one at [console.anthropic.com](https://console.anthropic.com/)
   - `BRAVE_SEARCH_API_KEY` — get one at [brave.com/search/api](https://brave.com/search/api/) (only needed for Cowork mode web search)

5. Start the API server and dev server in separate terminals:
   ```bash
   # Terminal 1 — API proxy
   node server.js

   # Terminal 2 — Vite dev server
   npx vite
   ```

6. Open the URL shown by Vite (typically `http://localhost:5173`)

## Tech Stack

- React + Vite
- Express API proxy (keeps API keys server-side)
- Claude API (Anthropic)
- Brave Search API (for Cowork mode)
