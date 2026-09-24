// Smart Study Assistant — backend server
// Serves the static frontend and proxies AI requests so the API key
// never reaches the browser.

require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Prompt templates for each feature, kept on the server so the
// frontend only ever sends the user's raw topic/question.
const PROMPTS = {
  ask: (text) =>
    `You are a friendly study tutor. Explain the following clearly and ` +
    `simply for a student, using short paragraphs or bullet points where ` +
    `useful:\n\n${text}`,
  notes: (text) =>
    `Turn this academic topic into compact study notes for a student. ` +
    `Include: Key Points (bulleted), Important Definitions, and a 2-3 ` +
    `sentence Summary. Keep it concise:\n\n${text}`,
  exam: (text) =>
    `Generate 6 exam-oriented questions on this topic, each with a ` +
    `concise model answer (2-4 sentences). Number them, and mix ` +
    `short-answer and conceptual questions:\n\n${text}`,
};

app.post('/api/generate', async (req, res) => {
  try {
    const { mode, text } = req.body || {};

    if (!PROMPTS[mode]) {
      return res.status(400).json({ error: 'Unknown mode.' });
    }
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Please provide some text.' });
    }
    if (!OPENAI_API_KEY) {
      return res
        .status(500)
        .json({ error: 'Server is missing OPENAI_API_KEY. See README.md.' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: PROMPTS[mode](text) }],
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('OpenAI API error:', response.status, errBody);
      return res
        .status(502)
        .json({ error: 'The AI provider returned an error. Try again shortly.' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || '';
    res.json({ result: reply });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Something went wrong on the server.' });
  }
});

app.listen(PORT, () => {
  console.log(`Smart Study Assistant running at http://localhost:${PORT}`);
});
