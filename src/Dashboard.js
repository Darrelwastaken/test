import React, { useState, useEffect } from "react";
import { FaCog } from 'react-icons/fa';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatMYR } from './utils';
import { useClientMetrics } from './hooks/useClientMetrics';
import { useTrendData } from './hooks/useTrendData';
import Sidebar from './Sidebar';
import { supabase } from './supabaseClient';
import AiAnalyzer from './components/AiAnalyzer';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// Set Chart.js global defaults for font and color
ChartJS.defaults.font.family = 'inherit';
ChartJS.defaults.font.size = 13;
ChartJS.defaults.color = '#222';
ChartJS.defaults.plugins.legend.labels.color = '#222';
ChartJS.defaults.plugins.tooltip.backgroundColor = '#222';
ChartJS.defaults.plugins.tooltip.titleColor = '#fff';
ChartJS.defaults.plugins.tooltip.bodyColor = '#fff';
ChartJS.defaults.plugins.legend.labels.boxWidth = 16;
ChartJS.defaults.plugins.legend.labels.boxHeight = 8;

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const { nric } = useParams();
  const location = useLocation();
  
  // Use the custom hook to get all metrics
  const {
    client,
    clientName,
    clientStatus,
    clientRiskProfile,
    manual,
    calculated,
    behavioral,
    trends,
    transactions,
    isLoading,
    error,
    refreshData
  } = useClientMetrics(nric);

  // Get trend data
  const { getTrendDataForType } = useTrendData(nric);

  // Trend tab state
  const [selectedTrendTab, setSelectedTrendTab] = useState('CASA');

  // Refresh data when returning to dashboard (only when coming from edit page)
  useEffect(() => {
    // Only refresh if we're coming from the edit page
    if (location.state?.fromEdit) {
      refreshData();
    }
  }, [location.pathname, refreshData, location.state?.fromEdit]);

  // Generate trend data based on selected tab
  const getTrendData = () => {
    const realData = getTrendDataForType(selectedTrendTab);
    
    switch (selectedTrendTab) {
      case 'CASA':
        return {
          label: 'CASA Total Amount',
          data: realData.data,
          labels: realData.labels,
          color: '#3b82f6',
          summary: {
            total: realData.data.reduce((sum, val) => sum + val, 0),
            avg: realData.data.reduce((sum, val) => sum + val, 0) / realData.data.length,
            peak: realData.labels[realData.data.indexOf(Math.max(...realData.data))] || 'N/A'
          }
        };
      case 'Cards':
        return {
          label: 'Card Spending',
          data: realData.data,
          labels: realData.labels,
          color: '#10b981',
          summary: {
            total: realData.data.reduce((sum, val) => sum + val, 0),
            avg: realData.data.reduce((sum, val) => sum + val, 0) / realData.data.length,
            peak: realData.labels[realData.data.indexOf(Math.max(...realData.data))] || 'N/A'
          }
        };
      case 'Investments':
        return {
          label: 'Portfolio Value',
          data: realData.data,
          labels: realData.labels,
          color: '#f59e0b',
          summary: {
            total: realData.data[realData.data.length - 1] || 0,
            avg: realData.data.reduce((sum, val) => sum + val, 0) / realData.data.length,
            peak: realData.labels[realData.data.indexOf(Math.max(...realData.data))] || 'N/A'
          }
        };
      case 'Loans':
        return {
          label: 'Outstanding Balance',
          data: realData.data,
          labels: realData.labels,
          color: '#ef4444',
          summary: {
            total: realData.data[realData.data.length - 1] || 0,
            avg: realData.data.reduce((sum, val) => sum + val, 0) / realData.data.length,
            peak: realData.labels[realData.data.indexOf(Math.max(...realData.data))] || 'N/A'
          }
        };
      default:
        return {
          label: 'Transactions',
          data: [],
          labels: [],
          color: '#6b7280',
          summary: { total: 0, avg: 0, peak: 'N/A' }
        };
    }
  };

  const trendData = getTrendData();

  // Improved helper to extract birthday from NRIC in DD-MM-YYYY format
  function getBirthdayFromNric(nric) {
    if (!nric) return '-';
    const clean = nric.replace(/[^0-9]/g, '');
    if (clean.length < 6) return '-';
    const yy = clean.slice(0, 2);
    const mm = clean.slice(2, 4);
    const dd = clean.slice(4, 6);
    const year = parseInt(yy, 10) > 30 ? '19' + yy : '20' + yy;
    return `${dd}-${mm}-${year}`;
  }

  if (isLoading) {
    return (
      <div style={{ background: '#f6f7f9', minHeight: '100vh' }}>
        <Sidebar clientId={nric} />
        <div style={{ padding: 32, marginLeft: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#374151' }}>Loading Dashboard...</div>
            <div style={{ color: '#6b7280' }}>Fetching client data and generating insights</div>
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
            <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#ef4444' }}>Error Loading Dashboard</div>
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

  if (!client) {
    return (
      <div style={{ background: '#f6f7f9', minHeight: '100vh' }}>
        <Sidebar clientId={nric} />
        <div style={{ padding: 32, marginLeft: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
          <div style={{ textAlign: 'center', background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#ef4444' }}>Client Not Found</div>
            <div style={{ color: '#6b7280', marginBottom: 24 }}>The client with NRIC {nric} could not be found.</div>
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

  // Calculate account balances from new data structure
  const dashboardAssets = calculated?.total_assets || 0;
  const dashboardAccountBalances = {
    casa: manual?.casa_balance || 0,
    fd: manual?.fixed_deposit_amount || 0,
    loans: calculated?.total_liabilities || 0,
    cards: manual?.credit_card_limit || 0
  };

  // Calculate monthly cash flow
  const dashboardCashflow = (manual?.monthly_inflow || 0) - (manual?.monthly_outflow || 0);

  // Generate monthly cash flow data for charts (removed unused variables)

  return (
    <div style={{ background: '#f6f7f9', minHeight: '100vh' }}>
      <Sidebar clientId={nric} />
      <main style={{ marginLeft: 240, padding: 32 }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#222' }}>{clientName || 'Client Dashboard'}</div>
        </div>

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

        <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 20 }}>Dashboard</h2>

        {/* Key Metrics */}
        {/* Removed: Total Assets, Net Position, Monthly Cash Flow, Utilization Rate */}

        {/* Profile and AI Insight Cards */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
          {/* Profile Card */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, flex: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{clientName || 'Client Name'}</div>
            <div style={{ color: '#6b7280', fontSize: 15, marginBottom: 4 }}>NRIC: {nric}</div>
            <div style={{ color: '#6b7280', fontSize: 15, marginBottom: 4 }}>Email: {client?.email || '-'}</div>
            <div style={{ color: '#6b7280', fontSize: 15, marginBottom: 4 }}>Status: {clientStatus || '-'}</div>
            <div style={{ color: '#6b7280', fontSize: 15, marginBottom: 4 }}>Risk Profile: {clientRiskProfile || '-'}</div>
            <div style={{ color: '#6b7280', fontSize: 15, marginBottom: 4 }}>Relationship Tier: {client?.relationship_tier || '-'}</div>
            <div style={{ color: '#6b7280', fontSize: 15, marginBottom: 4 }}>Credit Score: {client?.credit_score || '-'}</div>
            <div style={{ color: '#6b7280', fontSize: 15, marginBottom: 4 }}>DSR Ratio: {client?.dsr_ratio || '-'}</div>
            <div style={{ color: '#6b7280', fontSize: 15, marginBottom: 4 }}>Nationality: {client?.nationality || '-'}</div>
            <div style={{ color: '#6b7280', fontSize: 15, marginBottom: 4 }}>Gender: {client?.gender || '-'}</div>
            <div style={{ color: '#6b7280', fontSize: 15, marginBottom: 4 }}>Marital Status: {client?.marital_status || '-'}</div>
            <div style={{ color: '#6b7280', fontSize: 15, marginBottom: 4 }}>Employment Status: {client?.employment_status || '-'}</div>
            <div style={{ color: '#6b7280', fontSize: 15, marginBottom: 4 }}>Birthday: {getBirthdayFromNric(nric)}</div>
          </div>
          {/* AI Insight Card (modular component) */}
          <div style={{ flex: 2 }}>
            <AiAnalyzer clientData={{ ...client, transactions }} />
          </div>
        </div>

        {/* Account Balances and Transactions */}
        <div style={{ display: "flex", gap: 24 }}>
          {/* Account Balances */}
          <div style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            flex: 1,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
          }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Account Balances</div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <span style={{ width: 60 }}>CASA</span>
              <div style={{ background: "#e5e7eb", borderRadius: 4, height: 8, flex: 1, margin: "0 8px" }}>
                <div style={{ 
                width: `${dashboardAssets > 0 && dashboardAccountBalances?.casa ? (dashboardAccountBalances.casa / dashboardAssets) * 100 : 0}%`, 
                  background: "#6b7280", 
                  height: "100%", 
                  borderRadius: 4 
                }} />
              </div>
            <span>{formatMYR(dashboardAccountBalances?.casa || 0)}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <span style={{ width: 60 }}>FD</span>
              <div style={{ background: "#e5e7eb", borderRadius: 4, height: 8, flex: 1, margin: "0 8px" }}>
                <div style={{ 
                width: `${dashboardAssets > 0 && dashboardAccountBalances?.fd ? (dashboardAccountBalances.fd / dashboardAssets) * 100 : 0}%`, 
                  background: "#6b7280", 
                  height: "100%", 
                  borderRadius: 4 
                }} />
              </div>
            <span>{formatMYR(dashboardAccountBalances?.fd || 0)}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <span style={{ width: 60 }}>Loans</span>
              <div style={{ background: "#e5e7eb", borderRadius: 4, height: 8, flex: 1, margin: "0 8px" }}>
                <div style={{ 
                width: `${dashboardAssets > 0 && dashboardAccountBalances?.loans ? (dashboardAccountBalances.loans / dashboardAssets) * 100 : 0}%`, 
                  background: "#6b7280", 
                  height: "100%", 
                  borderRadius: 4 
                }} />
              </div>
            <span>{formatMYR(dashboardAccountBalances?.loans || 0)}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <span style={{ width: 60 }}>Cards</span>
              <div style={{ background: "#e5e7eb", borderRadius: 4, height: 8, flex: 1, margin: "0 8px" }}>
                <div style={{ 
                width: `${dashboardAssets > 0 && dashboardAccountBalances?.cards ? (dashboardAccountBalances.cards / dashboardAssets) * 100 : 0}%`, 
                  background: "#6b7280", 
                  height: "100%", 
                  borderRadius: 4 
                }} />
              </div>
            <span>{formatMYR(dashboardAccountBalances?.cards || 0)}</span>
            </div>
          </div>

          {/* Trend */}
          <div style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            flex: 1,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
          }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Trend</div>
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              {['CASA', 'Cards', 'Investments', 'Loans'].map((tab) => (
                <span
                  key={tab}
                  onClick={() => setSelectedTrendTab(tab)}
                  style={{
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontWeight: selectedTrendTab === tab ? 600 : 400,
                    color: selectedTrendTab === tab ? "#222" : "#888",
                    borderBottom: selectedTrendTab === tab ? "2px solid #222" : "2px solid transparent",
                    backgroundColor: selectedTrendTab === tab ? 'transparent' : 'transparent',
                    transition: 'all 0.2s ease',
                    userSelect: 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedTrendTab !== tab) {
                      e.target.style.color = '#222';
                      e.target.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = selectedTrendTab === tab ? '#222' : '#888';
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  {tab}
                </span>
              ))}
            </div>
            <div style={{ height: 80 }}>
              <Line 
                data={{
                  labels: trendData.labels,
                  datasets: [{
                    label: trendData.label,
                    data: trendData.data,
                    borderColor: trendData.color,
                    backgroundColor: `${trendData.color}20`,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: trendData.color,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      backgroundColor: '#222',
                      titleColor: '#fff',
                      bodyColor: '#fff',
                      borderColor: '#e5e7eb',
                      borderWidth: 1,
                      callbacks: {
                        label: function(context) {
                          return `${context.dataset.label}: ${formatMYR(context.parsed.y)}`;
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false
                      },
                      ticks: {
                        color: '#6b7280',
                        font: {
                          size: 11
                        }
                      }
                    },
                    y: {
                      grid: {
                        color: '#f3f4f6'
                      },
                      ticks: {
                        color: '#6b7280',
                        font: {
                          size: 11
                        },
                        callback: function(value) {
                          return formatMYR(value);
                        }
                      }
                    }
                  }
                }}
                height={180}
              />
            </div>
            
            {/* Trend Summary */}
            <div style={{ marginTop: 16, padding: 12, background: '#f9fafb', borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
                {selectedTrendTab} Monthly Summary
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <div>
                  <span style={{ color: '#6b7280' }}>
                    {selectedTrendTab === 'Investments' || selectedTrendTab === 'Loans' ? 'Current: ' : 'Total: '}
                  </span>
                  <span style={{ fontWeight: 500 }}>{formatMYR(trendData.summary.total)}</span>
                </div>
                <div>
                  <span style={{ color: '#6b7280' }}>Avg/Month: </span>
                  <span style={{ fontWeight: 500 }}>{formatMYR(trendData.summary.avg)}</span>
                </div>
                <div>
                  <span style={{ color: '#6b7280' }}>Peak: </span>
                  <span style={{ fontWeight: 500 }}>{trendData.summary.peak}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 