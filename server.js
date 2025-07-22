const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
app.use(express.json({ limit: '2mb' }));

// Use CORS middleware for all routes
app.use(cors());

// POST /ai-insight
// { "prompt": "...", "model": "llama2" }
app.post('/ai-insight', async (req, res) => {
  const { prompt, model = 'gemma' } = req.body; // default to gemma
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  try {
    const ollamaRes = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, stream: false })
    });
    if (!ollamaRes.ok) {
      const errText = await ollamaRes.text();
      return res.status(500).json({ error: 'Ollama error', details: errText });
    }
    const data = await ollamaRes.json();
    res.json({ result: data.response });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Add a GET /dashboard/:id route for dashboard data
app.get('/dashboard/:id', (req, res) => {
  const { id } = req.params;
  // Placeholder response; replace with real data as needed
  res.json({ message: `Dashboard data for ${id}` });
});

app.post('/api/analyze', async (req, res) => {
  const { clientData, followUp } = req.body;
  console.log('Received /api/analyze request:', { clientData, followUp });
  let prompt = `You are a banking AI assistant. Here is a client's profile and their recent transaction history:\n\nClient Profile:\n${JSON.stringify(clientData, null, 2)}\n\nBased on this data, generate a summary (bullet points), 3-5 actionable insights, risk signals, and product recommendations. Use clear, professional language.\n\nIMPORTANT: Format your response exactly as follows.\nSummary:\n- ...\nInsights:\n- ...\nRecommendations:\n- ...`;
  if (followUp && followUp.trim()) {
    prompt += `\n\nFollow-up question: ${followUp}`;
  }
  console.log('Prompt sent to Ollama:', prompt);
  try {
    const ollamaRes = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gemma', prompt, stream: false })
    });
    if (!ollamaRes.ok) {
      const errText = await ollamaRes.text();
      console.error('Ollama error:', errText);
      return res.status(500).json({ error: 'Ollama error', details: errText });
    }
    const data = await ollamaRes.json();
    const text = data.response || '';
    console.log('Ollama/Mistral raw output:', text);
    // Robust parsing: always try to extract sections, but if empty, return full text as fallback
    const summary = [];
    const insights = [];
    const recommendations = [];
    let current = null;
    text.split('\n').forEach(line => {
      const l = line.trim();
      if (/^summary[:]?$/i.test(l)) current = summary;
      else if (/^insights?[:]?$/i.test(l)) current = insights;
      else if (/^recommendations?[:]?$/i.test(l)) current = recommendations;
      else if (l.startsWith('-') || l.match(/^\d+\./)) {
        if (current) current.push(l.replace(/^[-\d. ]+/, ''));
      }
    });
    // Fallback: if all arrays are empty, return the full text in 'summary'
    if (summary.length === 0 && insights.length === 0 && recommendations.length === 0) {
      summary.push(text);
    }
    console.log('Parsed:', { summary, insights, recommendations });
    res.status(200).json({ summary, insights, recommendations });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

app.listen(3000, () => console.log('AI API running on http://localhost:3000')); 