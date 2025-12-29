# Juriscope AI Backend Module

Express router for proxying requests to a private Ollama instance with HTTP Basic Auth.

## Installation

Copy `routes/ai.js` to your Express backend project.

## Environment Variables

Add to your `.env` or server configuration:

```env
AI_OLLAMA_BASE_URL=https://ai.juriscope.trustena.lu
AI_OLLAMA_USER=your_username
AI_OLLAMA_PASS=your_password
AI_MODEL=mistral:latest
```

## Usage

In your main Express app:

```javascript
const express = require('express');
const aiRouter = require('./routes/ai');

const app = express();

app.use(express.json());
app.use('/ai', aiRouter);

app.listen(3000);
```

## Endpoints

### GET /ai/health

Check Ollama availability and list models.

**Response (200):**
```json
{
  "ok": true,
  "models": ["mistral:latest"]
}
```

**Response (503):**
```json
{
  "ok": false,
  "error": "unavailable"
}
```

### POST /ai/generate

Generate AI response from prompt.

**Request:**
```json
{
  "prompt": "Your question here"
}
```

**Response (200):**
```json
{
  "ok": true,
  "text": "AI response...",
  "model": "mistral:latest"
}
```

**Response (400):**
```json
{
  "ok": false,
  "error": "prompt is required"
}
```

**Response (503):**
```json
{
  "ok": false,
  "error": "unavailable"
}
```

## Security

- Credentials are never exposed to clients
- All Ollama calls use HTTP Basic Auth
- Prompt validation limits input to 20k characters
