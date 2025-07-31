import React from 'react';

export default function AIInsightsSummary({ aiInsights, recommendations }) {
  if (!aiInsights || aiInsights.length === 0) {
    return null;
  }

  const getInsightTypeColor = (type) => {
    switch (type) {
      case 'cash_flow_analysis': return { bg: '#dbeafe', text: '#1e40af' };
      case 'investment_opportunity': return { bg: '#dcfce7', text: '#166534' };
      case 'credit_analysis': return { bg: '#fef3c7', text: '#92400e' };
      case 'insurance_needs': return { bg: '#f3e8ff', text: '#7c3aed' };
      case 'risk_analysis': return { bg: '#fef2f2', text: '#dc2626' };
      case 'emergency_fund_analysis': return { bg: '#f0f9ff', text: '#0369a1' };
      case 'wealth_analysis': return { bg: '#f0fdf4', text: '#16a34a' };
      case 'travel_analysis': return { bg: '#fef7cd', text: '#d97706' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return { bg: '#dcfce7', text: '#166534' };
      case 'MEDIUM': return { bg: '#fef3c7', text: '#92400e' };
      case 'LOW': return { bg: '#f3f4f6', text: '#374151' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  // Group recommendations by AI insight
  const insightsWithProducts = aiInsights.map((insight, index) => {
    const relatedProducts = recommendations.filter(rec => rec.aiInsightIndex === index);
    return {
      ...insight,
      relatedProducts
    };
  });

  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '24px'
    }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
        AI Analysis & Product Recommendations
      </h2>
      
      <div style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
        Our AI analysis identified {aiInsights.length} key insights about your financial profile. 
        Below are the specific AmBank products recommended based on each insight.
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {insightsWithProducts.map((insight, index) => (
          <div key={index} style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px',
            background: '#f9fafb'
          }}>
            {/* AI Insight */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <div style={{
                  background: getInsightTypeColor(insight.type).bg,
                  color: getInsightTypeColor(insight.type).text,
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                  {insight.type?.replace(/_/g, ' ') || 'Analysis'}
                </div>
                <div style={{
                  background: getPriorityColor(insight.priority).bg,
                  color: getPriorityColor(insight.priority).text,
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {insight.priority} Priority
                </div>
                {insight.confidence && (
                  <div style={{
                    background: '#f0f9ff',
                    color: '#0369a1',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {Math.round(insight.confidence * 100)}% Confidence
                  </div>
                )}
              </div>
              
              <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px', color: '#111827' }}>
                {insight.insight || insight.text || 'AI Analysis Insight'}
              </div>
              
              {insight.reasoning && (
                <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.4' }}>
                  {insight.reasoning}
                </div>
              )}
            </div>

            {/* Related Products */}
            {insight.relatedProducts && insight.relatedProducts.length > 0 && (
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                  Recommended Products:
                </div>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {insight.relatedProducts.map((product, productIndex) => (
                    <div key={productIndex} style={{
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      padding: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '2px' }}>
                          {product.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {product.type} • {product.expectedReturn || product.monthlyPremium || product.interestRate}
                        </div>
                      </div>
                      <div style={{
                        background: product.priority === 'High' ? '#dcfce7' : product.priority === 'Medium' ? '#fef3c7' : '#f3f4f6',
                        color: product.priority === 'High' ? '#166534' : product.priority === 'Medium' ? '#92400e' : '#374151',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {product.priority}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Estimated Value */}
            {insight.estimatedValue && (
              <div style={{
                marginTop: '12px',
                padding: '8px 12px',
                background: '#f0f9ff',
                borderRadius: '6px',
                border: '1px solid #bae6fd'
              }}>
                <div style={{ fontSize: '12px', color: '#0369a1', fontWeight: '600' }}>
                  Estimated Opportunity Value: RM{insight.estimatedValue.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#334155' }}>
          AI Analysis Summary:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', fontSize: '12px' }}>
          <div>
            <div style={{ color: '#64748b' }}>Total Insights</div>
            <div style={{ fontWeight: '600', color: '#334155' }}>{aiInsights.length}</div>
          </div>
          <div>
            <div style={{ color: '#64748b' }}>High Priority</div>
            <div style={{ fontWeight: '600', color: '#dc2626' }}>
              {aiInsights.filter(i => i.priority === 'HIGH').length}
            </div>
          </div>
          <div>
            <div style={{ color: '#64748b' }}>Products Recommended</div>
            <div style={{ fontWeight: '600', color: '#334155' }}>{recommendations.length}</div>
          </div>
          <div>
            <div style={{ color: '#64748b' }}>Total Opportunity</div>
            <div style={{ fontWeight: '600', color: '#059669' }}>
              RM{aiInsights.reduce((sum, i) => sum + (i.estimatedValue || 0), 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 