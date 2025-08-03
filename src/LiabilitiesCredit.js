import React from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useResponsiveLayout } from './hooks/useResponsiveLayout';
import Sidebar from './Sidebar';
import { FaCog } from 'react-icons/fa';
import ClientHeader from './components/ClientHeader';
import { formatMYR } from './utils';
import { useClientMetrics } from './hooks/useClientMetrics';

export default function LiabilitiesCredit() {
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
            <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#374151' }}>Loading Liabilities & Credit...</div>
            <div style={{ color: '#6b7280' }}>Fetching client liabilities and credit information</div>
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
            <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#ef4444' }}>Error Loading Liabilities & Credit</div>
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
              {!client ? 'Client Not Found' : 'Liabilities Data Not Available'}
            </div>
            <div style={{ color: '#6b7280', marginBottom: 24 }}>
              {!client ? `The client with NRIC ${nric} could not be found.` : 'Liabilities and credit data is not available for this client.'}
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

  // Get liabilities data from manual data
  const liabilities = manual.liabilities || {};
  
  // Calculate total liabilities
  const totalLiabilities = calculated?.total_liabilities || 0;
  const utilizationRate = calculated?.utilization_rate || 0;

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
          showCrmButton={false}
        />
        
        <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 24 }}>Liabilities & Credit</h2>
        
        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>Total Liabilities</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#ef4444' }}>{formatMYR(totalLiabilities)}</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>Credit Utilization Rate</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b' }}>{utilizationRate.toFixed(1)}%</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>DSR Ratio</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>{manual.dsr_ratio || 'N/A'}</div>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: isMobile ? 16 : 32,
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          {/* Liabilities Details */}
          <div style={{ 
            background: '#fff', 
            borderRadius: 16, 
            padding: isMobile ? 16 : 24, 
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)', 
            flex: 1, 
            minWidth: isMobile ? '100%' : 320, 
            maxWidth: isMobile ? '100%' : 480 
          }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Liabilities Details</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#222' }}>Loan Outstanding Balance</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Total loan amount outstanding</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#ef4444' }}>
                  {formatMYR(liabilities.loan_outstanding_balance || 0)}
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#222' }}>Credit Card Limit</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Total credit card limit</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#3b82f6' }}>
                  {formatMYR(liabilities.credit_card_limit || 0)}
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#222' }}>Credit Card Used Amount</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Amount currently used</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#f59e0b' }}>
                  {formatMYR(liabilities.credit_card_used_amount || 0)}
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#222' }}>Overdraft Limit</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Overdraft facility limit</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#8b5cf6' }}>
                  {formatMYR(liabilities.overdraft_limit || 0)}
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#222' }}>Overdraft Used Amount</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Amount currently overdrawn</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#ef4444' }}>
                  {formatMYR(liabilities.overdraft_used_amount || 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Credit Analysis */}
          <div style={{ 
            background: '#fff', 
            borderRadius: 16, 
            padding: isMobile ? 16 : 24, 
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)', 
            flex: 1, 
            minWidth: isMobile ? '100%' : 320, 
            maxWidth: isMobile ? '100%' : 480 
          }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Credit Analysis</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#222' }}>Total Credit Limit</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Sum of all credit facilities</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#3b82f6' }}>
                  {formatMYR((liabilities.credit_card_limit || 0) + (liabilities.overdraft_limit || 0))}
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#222' }}>Total Credit Used</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Sum of all credit used</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#ef4444' }}>
                  {formatMYR((liabilities.credit_card_used_amount || 0) + (liabilities.overdraft_used_amount || 0))}
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#222' }}>Credit Utilization</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Percentage of credit used</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#f59e0b' }}>
                  {utilizationRate.toFixed(1)}%
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#222' }}>Available Credit</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Remaining credit limit</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#10b981' }}>
                  {formatMYR(((liabilities.credit_card_limit || 0) + (liabilities.overdraft_limit || 0)) - ((liabilities.credit_card_used_amount || 0) + (liabilities.overdraft_used_amount || 0)))}
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#222' }}>Risk Level</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Based on utilization rate</div>
                </div>
                <div style={{ 
                  fontSize: 16, 
                  fontWeight: 600, 
                  color: utilizationRate > 80 ? '#ef4444' : utilizationRate > 60 ? '#f59e0b' : '#10b981'
                }}>
                  {utilizationRate > 80 ? 'High' : utilizationRate > 60 ? 'Medium' : 'Low'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        {calculated && (
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginTop: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Financial Position</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Total Assets</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#10b981' }}>{formatMYR(calculated.total_assets)}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Total Liabilities</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#ef4444' }}>{formatMYR(calculated.total_liabilities)}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Net Position</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: calculated.net_position >= 0 ? '#10b981' : '#ef4444' }}>
                  {formatMYR(calculated.net_position)}
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Liability to Asset Ratio</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#f59e0b' }}>
                  {calculated.total_assets > 0 ? ((calculated.total_liabilities / calculated.total_assets) * 100).toFixed(1) : '0'}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 