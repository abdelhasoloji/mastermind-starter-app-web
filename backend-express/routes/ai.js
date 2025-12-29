/**
 * AI Router - Proxies requests to private Ollama instance
 * Mount at /ai in your Express app
 */

const express = require('express');
const router = express.Router();

const AI_OLLAMA_BASE_URL = process.env.AI_OLLAMA_BASE_URL;
const AI_OLLAMA_USER = process.env.AI_OLLAMA_USER;
const AI_OLLAMA_PASS = process.env.AI_OLLAMA_PASS;
const AI_MODEL = process.env.AI_MODEL || 'mistral:latest';

// Basic Auth header
const getAuthHeader = () => {
  const credentials = Buffer.from(`${AI_OLLAMA_USER}:${AI_OLLAMA_PASS}`).toString('base64');
  return `Basic ${credentials}`;
};

/**
 * GET /ai/health
 * Check Ollama availability and list models
 */
router.get('/health', async (req, res) => {
  try {
    const response = await fetch(`${AI_OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(),
      },
    });

    if (!response.ok) {
      return res.status(503).json({ ok: false, error: 'unavailable' });
    }

    const data = await response.json();
    const models = data.models?.map((m) => m.name) || [];

    return res.json({ ok: true, models });
  } catch (error) {
    return res.status(503).json({ ok: false, error: 'unavailable' });
  }
});

/**
 * POST /ai/generate
 * Generate AI response from prompt
 */
router.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  // Validate prompt
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ ok: false, error: 'prompt is required' });
  }

  if (prompt.length > 20000) {
    return res.status(400).json({ ok: false, error: 'prompt exceeds 20000 characters' });
  }

  try {
    const response = await fetch(`${AI_OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_MODEL,
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      return res.status(503).json({ ok: false, error: 'unavailable' });
    }

    const data = await response.json();

    return res.json({
      ok: true,
      text: data.response || '',
      model: AI_MODEL,
    });
  } catch (error) {
    return res.status(503).json({ ok: false, error: 'unavailable' });
  }
});

module.exports = router;
