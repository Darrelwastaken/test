import React, { useState, useEffect } from 'react';

export default function AiAnalyzer({ clientData }) {
  const [insights, setInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async (extraPrompt = '') => {
    setLoading(true);
          setError('');
    // Only send minimal client data for AI analysis
    const minimalClientData = clientData ? {
      client: {
        name: clientData.name,
        nric: clientData.nric,
        riskProfile: clientData.riskProfile,
        status: clientData.status
      },
      financial: {
        netWorth: clientData.netWorth,
        assetUtilization: clientData.assetUtilization
      },
      dashboard: {
        assets: clientData.assets,
        monthlyCashflow: clientData.monthlyCashflow,
        accountBalances: {
          casa: clientData.casa,
          fd: clientData.fd,
          loans: clientData.loans,
          cards: clientData.cards
        },
        cashflow: clientData.cashflow
      },
      investments: {
        holdings: clientData.holdings
      },
      liabilities: {
        liabilities: clientData.liabilities,
        creditLines: clientData.creditLines
      },
      transactions: clientData.transactions
    } : {};
    const payload = { clientData: minimalClientData, followUp: extraPrompt };
    console.log('clientData size:', JSON.stringify(minimalClientData).length);
    console.log("About to send fetch to http://localhost:3000/api/analyze", payload);
    try {
      const response = await fetch('http://localhost:3000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      
      // Handle different response formats
      if (Array.isArray(data.summary)) {
        // Old format - summary is an array of strings
        setSummary({ totalOpportunities: data.summary.length, estimatedValue: 0, topPriority: 'none' });
      } else {
        // New format - summary is an object
        setSummary(data.summary || {});
      }
      
      // Handle insights - could be array of strings or array of objects
      if (Array.isArray(data.insights)) {
        if (data.insights.length > 0 && typeof data.insights[0] === 'object') {
          // New format - array of objects with text property
          setInsights(data.insights);
        } else {
          // Old format - array of strings
          setInsights(data.insights.map(text => ({ text })));
        }
      } else {
        setInsights([]);
      }
      
      // Handle recommendations - could be array of strings or array of objects
      if (Array.isArray(data.recommendations)) {
        if (data.recommendations.length > 0 && typeof data.recommendations[0] === 'object') {
          // New format - array of objects with text property
          setRecommendations(data.recommendations);
        } else {
          // Old format - array of strings
          setRecommendations(data.recommendations.map(text => ({ text })));
        }
      } else {
        setRecommendations([]);
      }
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



  // Helper function to render insight/recommendation items
  const renderItem = (item, index) => {
    if (typeof item === 'string') {
      return (
        <div key={index} style={{ 
          background: '#f8f9fa', 
          padding: '12px', 
          borderRadius: '8px', 
          marginBottom: '8px',
          border: '1px solid #e9ecef'
        }}>
          {item}
        </div>
      );
    } else if (item && typeof item === 'object') {
      return (
        <div key={index} style={{ 
          background: '#f8f9fa', 
          padding: '12px', 
          borderRadius: '8px', 
          marginBottom: '8px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '4px', color: '#212529' }}>
            {item.text}
          </div>
          {item.priority && (
            <div style={{ 
              fontSize: '12px', 
              color: item.priority === 'HIGH' ? '#dc3545' : item.priority === 'MEDIUM' ? '#fd7e14' : '#198754',
              fontWeight: '500'
            }}>
              Priority: {item.priority}
            </div>
          )}
          {item.type && (
            <div style={{ fontSize: '12px', color: '#6c757d' }}>
              Type: {item.type}
            </div>
          )}
          {item.estimatedValue && (
            <div style={{ fontSize: '12px', color: '#0d6efd', fontWeight: '500' }}>
              Estimated Value: RM {item.estimatedValue.toLocaleString()}
            </div>
          )}
          {item.products && Array.isArray(item.products) && item.products.length > 0 && (
            <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
              Products: {item.products.join(', ')}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ 
      background: '#fff', 
      borderRadius: 16, 
      padding: 24, 
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      height: 'fit-content'
    }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>AI Insights</div>
      
      {loading && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '40px 20px',
          background: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          marginBottom: 20
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e9ecef',
            borderTop: '4px solid #0d6efd',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px'
          }}></div>
          <div style={{ 
            color: '#6c757d', 
            fontSize: '16px', 
            fontWeight: '500',
            textAlign: 'center'
          }}>
            Analyzing client data...
          </div>
          <div style={{ 
            color: '#adb5bd', 
            fontSize: '14px', 
            textAlign: 'center',
            marginTop: '8px'
          }}>
            Generating insights and recommendations
          </div>
        </div>
      )}
      
      {error && (
        <div style={{ 
          color: '#dc3545', 
          marginBottom: 16, 
          padding: '8px 12px',
          background: '#f8d7da',
          borderRadius: '6px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}
      

      
      {insights.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 8, color: '#212529' }}>AI Insights</div>
          <div>{insights.map(renderItem)}</div>
        </div>
      )}
      
      {recommendations.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 8, color: '#212529' }}>Recommendations</div>
          <div>{recommendations.map(renderItem)}</div>
        </div>
      )}
      
      {!loading && insights.length === 0 && recommendations.length === 0 && !error && (
        <div style={{ 
          color: '#6c757d', 
          margin: '16px 0',
          textAlign: 'center',
          padding: '20px',
          background: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          No insights available for this client.
        </div>
      )}
      

    </div>
  );
} 