import React, { useState, useEffect } from 'react';

export default function AiAnalyzer({ clientData }) {
  const [insights, setInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [followUpResponse, setFollowUpResponse] = useState('');

  const analyze = async (extraPrompt = '') => {
    setLoading(true);
    setError('');
    setFollowUpResponse('');
    // Only send minimal client data for AI analysis
    const minimalClientData = clientData ? {
      name: clientData.name,
      nric: clientData.nric,
      riskProfile: clientData.riskProfile,
      // Add more fields as needed for your use case
    } : {};
    const payload = { clientData: minimalClientData, followUp: extraPrompt };
    console.log('clientData size:', JSON.stringify(minimalClientData).length);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setSummary(data.summary || []);
      setInsights(data.insights || []);
      setRecommendations(data.recommendations || []);
      if (data.followUpResponse) setFollowUpResponse(data.followUpResponse);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clientData) {
      analyze();
    }
    // eslint-disable-next-line
  }, [clientData]);

  const handleFollowUp = async () => {
    if (followUp.trim()) {
      await analyze(followUp);
      setFollowUp('');
    }
  };

  return (
    <div className="ai-analyzer-block" style={{ border: '1px solid #eee', borderRadius: 8, padding: 24, margin: '24px 0', background: '#fafbfc' }}>
      <h3>AI Financial Insights</h3>
      <button onClick={() => analyze()} disabled={loading} style={{ marginBottom: 12 }}>
        {loading ? 'Analyzing...' : 'Generate Insights'}
      </button>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      {summary.length > 0 && (
        <>
          <h4>Summary</h4>
          <ul>{summary.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </>
      )}
      {insights.length > 0 && (
        <>
          <h4>AI Insights</h4>
          <ul>{insights.map((ins, i) => <li key={i}>{ins}</li>)}</ul>
        </>
      )}
      {recommendations.length > 0 && (
        <>
          <h4>Recommendations</h4>
          <ul>{recommendations.map((rec, i) => <li key={i}>{rec}</li>)}</ul>
        </>
      )}
      {!loading && summary.length === 0 && insights.length === 0 && recommendations.length === 0 && !error && (
        <div style={{ color: '#888', margin: '16px 0' }}>No insights available for this client.</div>
      )}
      {followUpResponse && <>
        <h4>Follow-up Response</h4>
        <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>{followUpResponse}</div>
      </>}
      <div style={{ marginTop: 16 }}>
        <textarea
          value={followUp}
          onChange={e => setFollowUp(e.target.value)}
          placeholder="Ask a follow-up question..."
          rows={2}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <button onClick={handleFollowUp} disabled={loading || !followUp.trim()}>
          Ask Follow-up
        </button>
      </div>
    </div>
  );
} 