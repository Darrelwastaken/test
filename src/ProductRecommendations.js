import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAIProductRecommendations } from './hooks/useAIProductRecommendations';
import ClientProfileSummary from './components/ClientProfileSummary';
import AIInsightsSummary from './components/AIInsightsSummary';

export default function ProductRecommendations() {
  const { nric } = useParams();
  const { recommendations, loading, error, clientProfile, aiInsights } = useAIProductRecommendations(nric);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [expandedCard, setExpandedCard] = useState(null);

  // Filter recommendations based on selected criteria
  const filteredRecommendations = recommendations.filter(rec => {
    const typeMatch = selectedType === 'All' || rec.type === selectedType;
    const priorityMatch = selectedPriority === 'All' || rec.priority === selectedPriority;
    return typeMatch && priorityMatch;
  });

  // Get unique types and priorities for filters
  const types = ['All', ...new Set(recommendations.map(rec => rec.type))];
  const priorities = ['All', ...new Set(recommendations.map(rec => rec.priority))];

  const getTypeColor = (type) => {
    switch (type) {
      case 'Savings': return { bg: '#dbeafe', text: '#1e40af' };
      case 'Investment': return { bg: '#dcfce7', text: '#166534' };
      case 'Insurance': return { bg: '#fef3c7', text: '#92400e' };
      case 'Credit': return { bg: '#f3e8ff', text: '#7c3aed' };
      case 'Islamic': return { bg: '#fef2f2', text: '#dc2626' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return { bg: '#dcfce7', text: '#166534' };
      case 'Medium': return { bg: '#fef3c7', text: '#92400e' };
      case 'Low': return { bg: '#f3f4f6', text: '#374151' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar clientId={nric} />
        <div style={{ flex: 1, padding: '32px', marginLeft: '240px' }}>
                  <div style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: '18px', color: '#666' }}>AI is analyzing your financial profile...</div>
          <div style={{ marginTop: '16px', fontSize: '14px', color: '#999' }}>
            Generating AI-powered product recommendations based on your data and insights
          </div>
        </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar clientId={nric} />
        <div style={{ flex: 1, padding: '32px', marginLeft: '240px' }}>
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ fontSize: '18px', color: '#dc2626', marginBottom: '8px' }}>
              Unable to load recommendations
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar clientId={nric} />
      <div style={{ flex: 1, padding: '32px', marginLeft: '240px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
            AI-Powered Product Recommendations
          </h1>
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '24px' }}>
            AI-powered product recommendations based on your financial profile and behavior patterns
          </p>

          {/* AI Insights Summary */}
          <AIInsightsSummary aiInsights={aiInsights} recommendations={recommendations} />

          {/* Client Profile Summary */}
          <ClientProfileSummary clientProfile={clientProfile} />

          {/* Filters */}
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}>
            <div>
              <label style={{ fontSize: '14px', color: '#666', marginBottom: '4px', display: 'block' }}>
                Product Type
              </label>
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  background: '#fff'
                }}
              >
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '14px', color: '#666', marginBottom: '4px', display: 'block' }}>
                Priority
              </label>
              <select 
                value={selectedPriority} 
                onChange={(e) => setSelectedPriority(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  background: '#fff'
                }}
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
                  <div style={{ 
          fontSize: '14px', 
          color: '#666', 
          marginBottom: '16px',
          padding: '8px 12px',
          background: '#f9fafb',
          borderRadius: '6px',
          border: '1px solid #e5e7eb'
        }}>
          Showing {filteredRecommendations.length} of {recommendations.length} AI-powered recommendations
        </div>
        </div>

        {filteredRecommendations.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '48px',
            background: '#f9fafb',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '18px', color: '#666', marginBottom: '8px' }}>
              No recommendations match your filters
            </div>
            <div style={{ fontSize: '14px', color: '#999' }}>
              Try adjusting your filter criteria
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '24px' }}>
            {filteredRecommendations.map((rec) => (
              <div
                key={rec.id}
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <div style={{ 
                        display: 'inline-block', 
                        background: getTypeColor(rec.type).bg,
                        color: getTypeColor(rec.type).text,
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {rec.type}
                      </div>
                      <div style={{ 
                        background: getPriorityColor(rec.priority).bg,
                        color: getPriorityColor(rec.priority).text,
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {rec.priority} Priority
                      </div>
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                      {rec.name}
                    </h3>
                    <p style={{ color: '#666', lineHeight: '1.5', marginBottom: '12px' }}>
                      {rec.description}
                    </p>
                    {rec.reasoning && (
                      <div style={{ 
                        background: '#f0f9ff', 
                        padding: '12px', 
                        borderRadius: '8px',
                        border: '1px solid #bae6fd',
                        fontSize: '14px',
                        color: '#0369a1'
                      }}>
                        <strong>Why this recommendation:</strong> {rec.reasoning}
                      </div>
                    )}
                  </div>
                </div>

                {/* Key metrics */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                  gap: '16px',
                  marginBottom: '20px'
                }}>
                  {rec.expectedReturn && (
                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Expected Return</div>
                      <div style={{ fontSize: '16px', fontWeight: '600' }}>{rec.expectedReturn}</div>
                    </div>
                  )}
                  {rec.risk && (
                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Risk Level</div>
                      <div style={{ fontSize: '16px', fontWeight: '600' }}>{rec.risk}</div>
                    </div>
                  )}
                  {rec.monthlyPremium && (
                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Monthly Premium</div>
                      <div style={{ fontSize: '16px', fontWeight: '600' }}>{rec.monthlyPremium}</div>
                    </div>
                  )}
                  {rec.coverage && (
                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Coverage Amount</div>
                      <div style={{ fontSize: '16px', fontWeight: '600' }}>{rec.coverage}</div>
                    </div>
                  )}
                  {rec.estimatedValue && (
                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Estimated Value</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#059669' }}>
                        RM{rec.estimatedValue.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Expandable details */}
                <div style={{ marginBottom: '20px' }}>
                  <button
                    onClick={() => setExpandedCard(expandedCard === rec.id ? null : rec.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#3b82f6',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      padding: '0',
                      textDecoration: 'underline'
                    }}
                  >
                    {expandedCard === rec.id ? 'Hide Details' : 'Show Details'}
                  </button>
                  
                  {expandedCard === rec.id && (
                    <div style={{ marginTop: '16px', padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                      {rec.features && (
                        <div style={{ marginBottom: '16px' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Key Features:</h4>
                          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#666' }}>
                            {rec.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {rec.requirements && (
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Requirements:</h4>
                          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#666' }}>
                            {rec.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button style={{
                    background: '#222',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#000'}
                  onMouseOut={(e) => e.target.style.background = '#222'}
                  >
                    Learn More
                  </button>
                  <button style={{
                    background: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#e5e7eb';
                    e.target.style.borderColor = '#9ca3af';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#f3f4f6';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                  >
                    Compare
                  </button>
                  <button style={{
                    background: '#059669',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#047857'}
                  onMouseOut={(e) => e.target.style.background = '#059669'}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 