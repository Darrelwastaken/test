import React from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useResponsiveLayout } from './hooks/useResponsiveLayout';
import Sidebar from './Sidebar';
import { FaCog } from 'react-icons/fa';
import ClientHeader from './components/ClientHeader';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { formatMYR } from './utils';
import { useClientMetrics } from './hooks/useClientMetrics';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function InvestmentsPortfolio() {
  const { nric } = useParams();
  const navigate = useNavigate();
  const { isMobile, sidebarOpen, setSidebarOpen, toggleSidebar, getMainContentStyle } = useResponsiveLayout();
  
  // Use the custom hook to get all metrics
  const {
    client,
    clientName,
    clientStatus,
    clientRiskProfile,
    manual,
    calculated,
    isLoading,
    error
  } = useClientMetrics(nric);

  if (isLoading) {
    return (
      <div style={{ background: '#f6f7f9', minHeight: '100vh' }}>
        <Sidebar 
          clientId={nric} 
          isMobile={isMobile}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          onClose={() => setSidebarOpen(false)}
        />
        <div style={{ ...getMainContentStyle(), display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#374151' }}>Loading Investments & Portfolio...</div>
            <div style={{ color: '#6b7280' }}>Fetching client investment holdings and portfolio data</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#f6f7f9', minHeight: '100vh' }}>
        <Sidebar 
          clientId={nric} 
          isMobile={isMobile}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          onClose={() => setSidebarOpen(false)}
        />
        <div style={{ ...getMainContentStyle(), display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
          <div style={{ textAlign: 'center', background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#ef4444' }}>Error Loading Investments & Portfolio</div>
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

  if (!client || !manual) {
    return (
      <div style={{ background: '#f6f7f9', minHeight: '100vh' }}>
        <Sidebar 
          clientId={nric} 
          isMobile={isMobile}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          onClose={() => setSidebarOpen(false)}
        />
        <div style={{ ...getMainContentStyle(), display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
          <div style={{ textAlign: 'center', background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#ef4444' }}>
              {!client ? 'Client Not Found' : 'Investment Data Not Available'}
            </div>
            <div style={{ color: '#6b7280', marginBottom: 24 }}>
              {!client ? `The client with NRIC ${nric} could not be found.` : 'Investment portfolio data is not available for this client.'}
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

  // Get product holdings from manual data
  const productHoldings = manual.product_holdings || [];
  
  // Prepare data for the chart
  const pieData = {
    labels: productHoldings.map(h => h.product_name),
    datasets: [
      {
        data: productHoldings.map(h => Number(h.value) || 0),
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'],
        borderWidth: 0,
      },
    ],
  };

  // Calculate total portfolio value
  const totalPortfolioValue = productHoldings.reduce((sum, holding) => sum + (Number(holding.value) || 0), 0);

  return (
    <div style={{ background: '#f6f7f9', minHeight: '100vh' }}>
      <Sidebar 
        clientId={nric} 
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        onClose={() => setSidebarOpen(false)}
      />
      <div style={getMainContentStyle()}>
        <ClientHeader
          clientName={clientName}
          clientStatus={clientStatus}
          clientRiskProfile={clientRiskProfile}
          nric={nric}
          isMobile={isMobile}
        />
        
        <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 24 }}>Investments & Portfolio</h2>
        
        {/* Portfolio Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>Total Portfolio Value</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#1e40af' }}>{formatMYR(totalPortfolioValue)}</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>Number of Holdings</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>{productHoldings.length}</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>Asset Utilization</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b' }}>{calculated?.asset_utilization?.toFixed(1) || '0'}%</div>
          </div>
        </div>

        {/* Portfolio Overview and Holdings in a row */}
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 32 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', flex: 1, minWidth: 320, maxWidth: 480, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Portfolio Overview</div>
            <div style={{ width: 180, height: 180, margin: '0 auto' }}>
              {productHoldings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                  <p style={{ color: '#888', fontSize: 18 }}>No holdings data available for this client.</p>
                </div>
              ) : (
                <Doughnut data={pieData} options={{ responsive: true, plugins: { legend: { display: true, position: 'bottom' } }, cutout: '70%' }} height={180} width={180} />
              )}
            </div>
          </div>
          
          {/* Holdings Table Card */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', flex: 1, minWidth: 320, maxWidth: 600 }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Product Holdings</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
              <thead>
                <tr style={{ background: '#f6f7f9' }}>
                  <th style={{ textAlign: 'left', fontWeight: 600, padding: '8px 8px' }}>Product Name</th>
                  <th style={{ textAlign: 'left', fontWeight: 600, padding: '8px 8px' }}>Type</th>
                  <th style={{ textAlign: 'right', fontWeight: 600, padding: '8px 8px' }}>Value</th>
                  <th style={{ textAlign: 'right', fontWeight: 600, padding: '8px 8px' }}>Count</th>
                </tr>
              </thead>
              <tbody>
                {productHoldings.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px 0' }}>No holdings data available for this client.</td>
                  </tr>
                ) : (
                  productHoldings.map((holding, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f1f1' }}>
                      <td style={{ padding: '8px 8px' }}>{holding.product_name}</td>
                      <td style={{ padding: '8px 8px' }}>{holding.product_type}</td>
                      <td style={{ padding: '8px 8px', textAlign: 'right' }}>{formatMYR(holding.value)}</td>
                      <td style={{ padding: '8px 8px', textAlign: 'right' }}>{holding.count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Investment Metrics */}
        {calculated && (
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: 32 }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Investment Metrics</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Total Assets</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#222' }}>{formatMYR(calculated.total_assets)}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Investment Portfolio</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#222' }}>{formatMYR(calculated.total_portfolio_value)}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Portfolio % of Assets</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#222' }}>
                  {calculated.total_assets > 0 ? ((calculated.total_portfolio_value / calculated.total_assets) * 100).toFixed(1) : '0'}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 