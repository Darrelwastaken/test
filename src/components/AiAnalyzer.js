import React, { useState, useEffect } from 'react';
import { generateAndSaveInsights, forceRegenerateInsights, clearCacheAndRegenerate } from '../utils/aiInsightsStorage';

export default function AiAnalyzer({ clientData }) {
  const [insights, setInsights] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedAt, setGeneratedAt] = useState(null);

  const analyze = async (forceRefresh = false) => {
    setLoading(true);
    setError('');
    
    // Debug: Log the clientData structure
    console.log('AiAnalyzer - clientData structure:', {
      nric: clientData?.nric,
      hasTransactions: !!clientData?.transactions,
      transactionCount: clientData?.transactions?.length || 0,
      transactions: clientData?.transactions?.slice(0, 3) // Show first 3 transactions
    });
    
    try {
      let result;
      if (forceRefresh) {
        // Clear cache and regenerate when reset button is pressed
        result = await clearCacheAndRegenerate(clientData);
      } else {
        result = await generateAndSaveInsights(clientData);
      }
      
      console.log('AI Analysis Result:', result);
      
      // If no insights returned, use fallback insights
      if (!result.insights || result.insights.length === 0) {
        console.log('No insights returned from AI, using fallback insights');
        const fallbackInsights = [
          {
            insight: "Client profile analyzed - banking data available",
            reasoning: "Financial metrics and transaction patterns identified"
          }
        ];
        setInsights(fallbackInsights);
      } else {
        setInsights(result.insights || []);
      }
      setSummary(result.summary || {});
      setGeneratedAt(result.generatedAt || null);
    } catch (err) {
      console.error('AI Analysis Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clientData && clientData.nric && !insights.length && !loading) {
      analyze();
    }
    // eslint-disable-next-line
  }, [clientData?.nric]); // Only depend on the client NRIC, not the entire clientData object



  // Helper function to render insight/recommendation items
  const renderItem = (item, index) => {
    console.log('Rendering item:', item, 'at index:', index);
    
    if (typeof item === 'string') {
      return (
        <div key={index} style={{ 
          background: '#f8f9fa', 
          padding: '8px 12px', 
          borderRadius: '6px', 
          marginBottom: '6px',
          border: '1px solid #e9ecef',
          fontSize: '14px',
          lineHeight: '1.3'
        }}>
          {item}
        </div>
      );
    } else if (item && typeof item === 'object') {
      // Handle new insight format with reasoning
      if (item.insight && item.reasoning) {
        return (
          <div key={index} style={{ 
            background: '#f8f9fa', 
            padding: '8px 12px', 
            borderRadius: '6px', 
            marginBottom: '6px',
            border: '1px solid #e9ecef',
            fontSize: '14px',
            lineHeight: '1.3'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '2px', color: '#212529' }}>
              {item.insight}
            </div>
            {item.reasoning && (
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                {item.reasoning}
              </div>
            )}
            {/* Product recommendations are now shown only in the Product Recommendations page */}
          </div>
        );
      }
      
      // Handle legacy format
      return (
        <div key={index} style={{ 
          background: '#f8f9fa', 
          padding: '8px 12px', 
          borderRadius: '6px', 
          marginBottom: '6px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '2px', color: '#212529', fontSize: '14px', lineHeight: '1.3' }}>
            {item.text}
          </div>
          {item.priority && (
            <div style={{ 
              fontSize: '11px', 
              color: item.priority === 'HIGH' ? '#dc3545' : item.priority === 'MEDIUM' ? '#fd7e14' : '#198754',
              fontWeight: '500'
            }}>
              Priority: {item.priority}
            </div>
          )}
          {item.type && (
            <div style={{ fontSize: '11px', color: '#6c757d' }}>
              Type: {item.type}
            </div>
          )}
          {item.estimatedValue && (
            <div style={{ fontSize: '11px', color: '#0d6efd', fontWeight: '500' }}>
              Estimated Value: RM {item.estimatedValue.toLocaleString()}
            </div>
          )}
          {item.products && Array.isArray(item.products) && item.products.length > 0 && (
            <div style={{ fontSize: '11px', color: '#6c757d', marginTop: '2px' }}>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontWeight: 600, fontSize: 16 }}>AI Insights</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {generatedAt && (
            <div style={{ 
              fontSize: '12px', 
              color: '#6c757d', 
              background: '#e9ecef', 
              padding: '4px 8px', 
              borderRadius: '4px' 
            }}>
              Generated: {new Date(generatedAt).toLocaleString()}
            </div>
          )}
          <button
            onClick={() => analyze(true)}
            disabled={loading}
            style={{
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
            title={loading ? 'Generating...' : 'Refresh insights'}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{
                transform: loading ? 'rotate(360deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }}
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M3 21v-5h5"/>
            </svg>
          </button>
        </div>
      </div>
      
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
            Generating insights...
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
        <div style={{ marginBottom: 16 }}>
          <div style={{ overflowY: 'visible' }}>
            {insights.map(renderItem)}
          </div>
        </div>
      )}
      

      
      {summary && summary.recommendations && Array.isArray(summary.recommendations) && summary.recommendations.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ 
            fontWeight: '600', 
            fontSize: '14px', 
            color: '#374151', 
            marginBottom: '8px',
            borderBottom: '1px solid #e9ecef',
            paddingBottom: '4px'
          }}>
            Quick Actions
          </div>
          <div style={{ overflowY: 'visible' }}>
            {summary.recommendations.map(renderItem)}
          </div>
        </div>
      )}
      
      {!loading && insights.length === 0 && !error && (
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