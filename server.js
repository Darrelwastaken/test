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
  
  try {
    // Only use Gemini for AI insights
    const { analyzeClientWithGemini } = await import('./src/utils/aiAnalyzer.js');
    const transactions = clientData.transactions || [];
    const result = await analyzeClientWithGemini(clientData, transactions, followUp);
    console.log('Gemini analysis result:', result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      error: error.message || 'Gemini API Error',
      summary: [],
      insights: [],
      recommendations: []
    });
  }
});

app.listen(3000, () => console.log('AI API running on http://localhost:3000')); 