import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { FaCog, FaArrowUp, FaArrowDown, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, DoughnutController, Filler } from 'chart.js';
import { formatMYR } from './utils';
import { useClientMetrics } from './hooks/useClientMetrics';
import { useFinancialSummary } from './hooks/useFinancialSummary';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, DoughnutController, Filler);

export default function FinancialSummary() {
  const { nric } = useParams();
  const navigate = useNavigate();
  
  // Use the custom hooks to get all metrics
  const {
    client,
    clientName,
    clientStatus,
    clientRiskProfile,
    financialNetWorth,
    financialMonthlyCashflow,
    financialAssetUtilization,
    financialAssetsBreakdown,
    financialLiabilitiesBreakdown,
    isLoading: clientLoading,
    error: clientError
  } = useClientMetrics(nric);

  // Use the financial summary hook to get real data
  const {
    financialData,
    isLoading: financialLoading,
    error: financialError
  } = useFinancialSummary(nric);

    // Combine loading states
  const isLoading = clientLoading || financialLoading;
  const error = clientError || financialError;



  if (isLoading) {
    return (
      <div style={{ background: '#f6f7f9', minHeight: '100vh' }}>
        <Sidebar clientId={nric} />
        <div style={{ padding: 32, marginLeft: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#374151' }}>Loading Financial Summary...</div>
            <div style={{ color: '#6b7280' }}>Fetching client financial data</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#f6f7f9', minHeight: '100vh' }}>
        <Sidebar clientId={nric} />
        <div style={{ padding: 32, marginLeft: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
          <div style={{ textAlign: 'center', background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#ef4444' }}>Error Loading Financial Summary</div>
            <div style={{ color: '#6b7280', marginBottom: 24 }}>{error}</div>
            <button 
              style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 500, cursor: 'pointer' }}
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!client || !financialData) {
    return (
      <div style={{ background: '#f6f7f9', minHeight: '100vh' }}>
        <Sidebar clientId={nric} />
        <div style={{ padding: 32, marginLeft: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
          <div style={{ textAlign: 'center', background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#ef4444' }}>
              {!client ? 'Client Not Found' : 'Financial Data Not Available'}
            </div>
            <div style={{ color: '#6b7280', marginBottom: 24 }}>
              {!client ? `The client with NRIC ${nric} could not be found.` : 'Financial summary data is not available for this client.'}
            </div>
            <button 
              style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 500, cursor: 'pointer' }}
              onClick={() => navigate('/clients')}
            >
              Back to Client Selection
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getRiskIndicatorIcon = (severity) => {
    switch (severity) {
      case 'high': return <FaTimesCircle style={{ color: '#ef4444' }} />;
      case 'medium': return <FaExclamationTriangle style={{ color: '#f59e0b' }} />;
      case 'low': return <FaCheckCircle style={{ color: '#10b981' }} />;
      default: return <FaCheckCircle style={{ color: '#10b981' }} />;
    }
  };

  const getRiskIndicatorColor = (severity) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#10b981';
    }
  };

  return (
    <div style={{ background: '#f6f7f9', minHeight: '100vh' }}>
      <Sidebar clientId={nric} />
      <div style={{ padding: '20px 16px', marginLeft: 240, width: 'calc(100% - 240px)', boxSizing: 'border-box', overflowX: 'hidden' }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20
        }}>
          <div>
            <span style={{ fontSize: 24, fontWeight: 700 }}>{clientName || 'Client Not Found'}</span>
            {clientStatus && (
              <span style={{
                marginLeft: 12,
                background: clientStatus === 'Dormant' ? '#fde68a' : clientStatus === 'High Risk' ? '#fecaca' : '#e5e7eb',
                color: clientStatus === 'Dormant' ? '#b45309' : clientStatus === 'High Risk' ? '#b91c1c' : '#222',
                borderRadius: 6,
                padding: '3px 8px',
                fontWeight: 500,
                fontSize: 14
              }}>{clientStatus}</span>
            )}
            <div style={{ marginTop: 6, color: "#555", fontSize: 14 }}>
              {clientRiskProfile ? (<>
                Risk Profile <b>{clientRiskProfile}</b> &nbsp;|&nbsp; Priority
              </>) : null}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 6, padding: "6px 12px", fontWeight: 500, cursor: "pointer", fontSize: 14 }} onClick={() => navigate(`/edit-client-info/${nric}`)}>Edit Client Info</button>
            <button style={{
              background: "#222",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "6px 12px",
              fontWeight: 500,
              cursor: "pointer",
              fontSize: 14
            }}>View CRM Notes</button>
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: '#222' }}
              title="Settings"
              onClick={() => navigate('/settings')}
            >
              <FaCog />
            </button>
          </div>
        </div>

        <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 20 }}>Financial Summary</h2>

        {/* Responsive Top Row - Key Financial Metrics */}
        <div
          style={{
            display: 'grid',
            gap: 8,
            marginBottom: 20,
            gridTemplateColumns: 'repeat(2, 1fr)',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {/* Total Assets */}
          <div style={{ background: '#fff', borderRadius: 8, padding: '12px 8px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ width: 28, height: 28, background: '#dbeafe', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                <FaArrowUp style={{ color: '#1e40af', fontSize: 14 }} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Total Assets</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#1e40af' }}>{formatMYR(financialData.totalAssets)}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>
              Deposits, investments, wallet balances
            </div>
          </div>

          {/* Total Liabilities */}
          <div style={{ background: '#fff', borderRadius: 8, padding: '12px 8px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ width: 28, height: 28, background: '#fecaca', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                <FaArrowDown style={{ color: '#dc2626', fontSize: 14 }} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Total Liabilities</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#dc2626' }}>{formatMYR(financialData.totalLiabilities)}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>
              Loans, credit cards, overdrafts
            </div>
          </div>

          {/* Net Position */}
          <div style={{ background: '#fff', borderRadius: 8, padding: '12px 8px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ width: 28, height: 28, background: '#dcfce7', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                <FaArrowUp style={{ color: '#16a34a', fontSize: 14 }} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Net Position</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#16a34a' }}>{formatMYR(financialData.netPosition)}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>
              Assets – Liabilities
            </div>
          </div>

          {/* Monthly Net Cash Flow */}
          <div style={{ background: '#fff', borderRadius: 8, padding: '12px 8px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ width: 28, height: 28, background: '#fef3c7', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                <FaArrowUp style={{ color: '#d97706', fontSize: 14 }} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Monthly Net Cash Flow</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#d97706' }}>{formatMYR(financialData.monthlyCashFlow.netFlow)}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>
              Inflow: {formatMYR(financialData.monthlyCashFlow.inflow)} | Outflow: {formatMYR(financialData.monthlyCashFlow.outflow)}
            </div>
          </div>
        </div>

        {/* Second Row - Product Holdings and Relationship Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 20 }}>
          {/* Product Holding Summary */}
          <div style={{ background: '#fff', borderRadius: 8, padding: '16px 12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 14 }}>Product Holding Summary</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {financialData.productHoldings.map((product, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#f9fafb', borderRadius: 4 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{product.name}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{product.count} product{product.count > 1 ? 's' : ''}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#1e40af' }}>
                    {formatMYR(product.value)}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, padding: '8px 10px', background: '#dbeafe', borderRadius: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Total Portfolio Value</span>
                <span style={{ fontWeight: 700, fontSize: 16, color: '#1e40af' }}>
                  {formatMYR(financialData.productHoldings.reduce((sum, p) => sum + p.value, 0))}
                </span>
              </div>
            </div>
          </div>

          {/* Relationship Tier & Profitability */}
          <div style={{ background: '#fff', borderRadius: 8, padding: '16px 12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Relationship & Profitability</h3>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 6 }}>Relationship Tier</div>
              <div style={{ 
                background: '#fef3c7', 
                color: '#92400e', 
                padding: '6px 12px', 
                borderRadius: 6, 
                fontWeight: 600, 
                fontSize: 16,
                textAlign: 'center'
              }}>
                {financialData.relationshipTier}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 6 }}>Profitability Score</div>
              <div style={{ position: 'relative', marginBottom: 6 }}>
                <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3 }}>
                  <div style={{ 
                    width: `${(financialData.profitabilityScore <= 1 ? financialData.profitabilityScore * 100 : financialData.profitabilityScore).toFixed(1)}%`, 
                    height: '100%', 
                    background: '#10b981', 
                    borderRadius: 3 
                  }} />
                </div>
              </div>
              <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 18, color: '#10b981' }}>
                {((financialData.profitabilityScore <= 1 ? financialData.profitabilityScore * 100 : financialData.profitabilityScore).toFixed(1))}/100
              </div>
            </div>

            <div>
              <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 6 }}>Customer Lifetime Value</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#1e40af' }}>
                {formatMYR(financialData.customerLifetimeValue)}
              </div>
            </div>
          </div>
        </div>

        {/* Third Row - Credit Utilization and Risk Indicators */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {/* Credit Utilization vs Limits */}
          <div style={{ background: '#fff', borderRadius: 8, padding: '16px 12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Credit Utilization vs Limits</h3>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 14, color: '#6b7280' }}>Credit Card / Line of Credit</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{financialData.creditUtilization.utilizationRate.toFixed(2)}%</span>
              </div>
              <div style={{ height: 8, background: '#e5e7eb', borderRadius: 4, marginBottom: 6 }}>
                <div style={{ 
                  width: `${financialData.creditUtilization.utilizationRate.toFixed(2)}%`, 
                  height: '100%', 
                  background: financialData.creditUtilization.utilizationRate > 70 ? '#ef4444' : 
                             financialData.creditUtilization.utilizationRate > 50 ? '#f59e0b' : '#10b981', 
                  borderRadius: 4 
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280' }}>
                <span>Used: {formatMYR(financialData.creditUtilization.usedAmount)}</span>
                <span>Limit: {formatMYR(financialData.creditUtilization.totalLimit)}</span>
              </div>
            </div>

            <div style={{ background: '#f9fafb', padding: 12, borderRadius: 6 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Credit Health</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>
                {financialData.creditUtilization.utilizationRate <= 30 ? 'Excellent - Low utilization' :
                 financialData.creditUtilization.utilizationRate <= 50 ? 'Good - Moderate utilization' :
                 financialData.creditUtilization.utilizationRate <= 70 ? 'Fair - High utilization' :
                 'Poor - Very high utilization'}
              </div>
            </div>
          </div>

          {/* Early Risk Indicators */}
          <div style={{ background: '#fff', borderRadius: 8, padding: '16px 12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Early Risk Indicators</h3>
            
            <div style={{ display: 'grid', gap: 8 }}>
              {financialData.riskIndicators.map((indicator, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '8px 10px', 
                  background: '#f9fafb', 
                  borderRadius: 4,
                  border: `1px solid ${getRiskIndicatorColor(indicator.severity)}20`
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{indicator.type}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{indicator.status}</div>
                  </div>
                  <div style={{ color: getRiskIndicatorColor(indicator.severity) }}>
                    {getRiskIndicatorIcon(indicator.severity)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 12, padding: '8px 10px', background: '#dcfce7', borderRadius: 4 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#16a34a' }}>Overall Risk Assessment</div>
              <div style={{ fontSize: 12, color: '#16a34a' }}>Low risk profile - All indicators healthy</div>
            </div>
          </div>
        </div>

        {/* Fourth Row - Financial Trends Chart */}
        <div style={{ background: '#fff', borderRadius: 8, padding: '16px 12px', border: '1px solid #e5e7eb', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Financial Trends (6-Month Overview)</h3>
          <div style={{ height: 250 }}>
            <Line 
              data={{
                labels: financialData.financialTrends.months,
                datasets: [
                  {
                    label: 'Total Assets',
                    data: financialData.financialTrends.assets,
                    borderColor: '#1e40af',
                    backgroundColor: 'rgba(30, 64, 175, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 6,
                    pointBackgroundColor: '#1e40af'
                  },
                  {
                    label: 'Total Liabilities',
                    data: financialData.financialTrends.liabilities,
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 6,
                    pointBackgroundColor: '#dc2626'
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                  legend: { 
                    display: true, 
                    position: 'top',
                    labels: {
                      usePointStyle: true,
                      padding: 20
                    }
                  }
                },
                scales: {
                  x: { 
                    grid: { color: '#e5e7eb' }, 
                    ticks: { color: '#6b7280', font: { size: 14 } } 
                  },
                  y: { 
                    grid: { color: '#e5e7eb' }, 
                    ticks: { 
                      color: '#6b7280', 
                      font: { size: 14 },
                      callback: function(value) {
                        return formatMYR(value);
                      }
                    } 
                  }
                },
                interaction: {
                  intersect: false,
                  mode: 'index'
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 
 