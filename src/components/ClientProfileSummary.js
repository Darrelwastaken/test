import React from 'react';

export default function ClientProfileSummary({ clientProfile }) {
  if (!clientProfile) return null;

  const { riskProfile, investmentProfile, clientData } = clientProfile;

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'Aggressive': return { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' };
      case 'Moderate': return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
      case 'Conservative': return { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe' };
      default: return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
    }
  };

  const getInvestmentTypeColor = (type) => {
    switch (type) {
      case 'Advanced': return { bg: '#dcfce7', text: '#166534' };
      case 'Intermediate': return { bg: '#fef3c7', text: '#92400e' };
      case 'Beginner': return { bg: '#dbeafe', text: '#1e40af' };
      case 'New': return { bg: '#f3e8ff', text: '#7c3aed' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

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
        Your Financial Profile
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Risk Profile */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
            Risk Profile
          </h3>
          <div style={{
            background: getRiskLevelColor(riskProfile.riskLevel).bg,
            color: getRiskLevelColor(riskProfile.riskLevel).text,
            border: `1px solid ${getRiskLevelColor(riskProfile.riskLevel).border}`,
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '12px'
          }}>
            <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
              {riskProfile.riskLevel}
            </div>
            <div style={{ fontSize: '14px' }}>
              Risk Score: {riskProfile.riskScore}/10
            </div>
          </div>
          
          {riskProfile.riskFactors.length > 0 && (
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#666' }}>
                Risk Factors:
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#666' }}>
                {riskProfile.riskFactors.map((factor, index) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Investment Profile */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
            Investment Profile
          </h3>
          <div style={{
            background: getInvestmentTypeColor(investmentProfile.type).bg,
            color: getInvestmentTypeColor(investmentProfile.type).text,
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '12px'
          }}>
            <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
              {investmentProfile.type}
            </div>
            <div style={{ fontSize: '14px' }}>
              Investment Experience Level
            </div>
          </div>

          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#666' }}>
            Recommended Allocation:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '14px' }}>
            <div style={{ textAlign: 'center', padding: '8px', background: '#f9fafb', borderRadius: '6px' }}>
              <div style={{ fontWeight: '600' }}>{investmentProfile.allocation.savings}%</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Savings</div>
            </div>
            <div style={{ textAlign: 'center', padding: '8px', background: '#f9fafb', borderRadius: '6px' }}>
              <div style={{ fontWeight: '600' }}>{investmentProfile.allocation.investments}%</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Investments</div>
            </div>
            <div style={{ textAlign: 'center', padding: '8px', background: '#f9fafb', borderRadius: '6px' }}>
              <div style={{ fontWeight: '600' }}>{investmentProfile.allocation.insurance}%</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Insurance</div>
            </div>
          </div>
        </div>

        {/* Key Financial Metrics */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
            Key Metrics
          </h3>
          <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f9fafb', borderRadius: '6px' }}>
              <span>Age:</span>
              <span style={{ fontWeight: '600' }}>{clientData.age} years</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f9fafb', borderRadius: '6px' }}>
              <span>Monthly Income:</span>
              <span style={{ fontWeight: '600' }}>RM{clientData.monthlyIncome.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f9fafb', borderRadius: '6px' }}>
              <span>Net Cash Flow:</span>
              <span style={{ fontWeight: '600', color: clientData.netCashFlow >= 0 ? '#059669' : '#dc2626' }}>
                RM{clientData.netCashFlow.toLocaleString()}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f9fafb', borderRadius: '6px' }}>
              <span>Total Assets:</span>
              <span style={{ fontWeight: '600' }}>RM{clientData.totalAssets.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f9fafb', borderRadius: '6px' }}>
              <span>Credit Utilization:</span>
              <span style={{ fontWeight: '600', color: clientData.creditUtilization > 70 ? '#dc2626' : '#059669' }}>
                {clientData.creditUtilization.toFixed(1)}%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f9fafb', borderRadius: '6px' }}>
              <span>Emergency Fund:</span>
              <span style={{ fontWeight: '600', color: clientData.emergencyFundRatio >= 100 ? '#059669' : '#dc2626' }}>
                {clientData.emergencyFundRatio.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Profile Recommendations */}
      {investmentProfile.recommendations.length > 0 && (
        <div style={{ marginTop: '20px', padding: '16px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#0369a1' }}>
            Investment Strategy Recommendations:
          </h4>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#0369a1' }}>
            {investmentProfile.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 