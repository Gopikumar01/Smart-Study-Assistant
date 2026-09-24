# Smart Study Assistant

An AI-powered study assistant built with Generative AI + NLP. Ask questions,
turn topics into smart notes, and generate exam-ready practice questions.

**Learn Smarter. Prepare Better. Achieve More.**

## Features

- **Ask AI** — get clear, student-friendly explanations of any topic
- **Smart Notes** — turns a topic into key points, definitions, and a summary
- **Exam Prep** — generates exam-oriented questions with model answers
- **Subjects** — quick-start prompts for CS, AI & ML, Math, Networking,
  Compiler Design, and Databases

## Tech stack

- Frontend: plain HTML/CSS/JS (no build step)
- Backend: Node.js + Express, proxies requests to OpenAI's API so your
  API key is never exposed to the browser

## Project structure

```
smart-study-assistant/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js
├── package.json
├── .env.example
└── .gitignore
```

## Setup

1. **Clone the repo and install dependencies**

   ```bash
   git clone https://github.com/<your-username>/smart-study-assistant.git
   cd smart-study-assistant
   npm install
   ```

2. **Add your API key**

   Copy `.env.example` to `.env` and add your own OpenAI API key:

   ```bash
   cp .env.example .env
   ```

   ```
   OPENAI_API_KEY=sk-your-key-here
   OPENAI_MODEL=gpt-4o-mini
   PORT=3000
   ```

   Get a key at https://platform.openai.com/api-keys.
   `.env` is already in `.gitignore` — never commit it.

3. **Run it**

   ```bash
   npm start
   ```

   Visit http://localhost:3000

## Deploying

This is a standard Node/Express app, so it deploys to any Node host —
Render, Railway, Fly.io, Vercel (as a Node server), or a VPS. The general
steps:

1. Push this repo to GitHub.
2. Create a new web service on your host of choice, pointing at the repo.
3. Set the build command to `npm install` and start command to `npm start`.
4. Add `OPENAI_API_KEY` (and optionally `OPENAI_MODEL`) as an environment
   variable in the host's dashboard — never in the code.

## Using a different AI provider

The prompt-building logic lives in `server.js` inside the `PROMPTS` object,
and the API call is a single `fetch` to OpenAI's chat completions endpoint.
To swap in Anthropic's Claude API (or another provider) instead, replace the
`fetch` call in the `/api/generate` route with a call to your provider's
endpoint, keeping the same request/response shape the frontend expects:
`{ result: "<generated text>" }`.

## License

MIT — free to use and modify for your own projects.
