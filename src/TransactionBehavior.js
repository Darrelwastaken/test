import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';
import { useResponsiveLayout } from './hooks/useResponsiveLayout';
import Sidebar from './Sidebar';
import ClientHeader from './components/ClientHeader';
import { supabase } from './supabaseClient';

export default function TransactionBehavior() {
  const { nric } = useParams();
  const navigate = useNavigate();
  const { isMobile, sidebarOpen, setSidebarOpen, toggleSidebar, getMainContentStyle } = useResponsiveLayout();
  const [client, setClient] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch client info
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('nric', nric)
          .single();
        if (clientError) throw clientError;
        setClient(clientData);

        // Fetch transactions for the client (no date filter for debugging)
        const { data: txns, error: txnError } = await supabase
          .from('transactions')
          .select('*')
          .eq('client_nric', nric)
          .order('transaction_date', { ascending: false });
        if (txnError) throw txnError;
        setTransactions(txns || []);
      } catch (err) {
        setError(err.message || 'Error loading data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [nric]);

  // Calculate summaries
  const totalTransactions = transactions.length;
  const totalVolume = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const averageTransaction = totalTransactions > 0 ? totalVolume / totalTransactions : 0;
  // Most active day
  const dayCounts = {};
  transactions.forEach(t => {
    const day = t.transaction_date;
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  const mostActiveDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  // Categorised spending
  const categoryTotals = {};
  transactions.forEach(t => {
    if (t.category) {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
    }
  });
  const categorisedSpending = Object.entries(categoryTotals).map(([category, amount], i) => ({ id: i, category, amount }));
  // Large or unusual transactions (e.g., amount > 1000)
  const unusualTransactions = transactions.filter(t => Number(t.amount) > 1000);
  // Fund transfers
  const fundTransfers = transactions.filter(t => t.type === 'transfer');
  const intraBank = fundTransfers.filter(t => t.description?.toLowerCase().includes('savings'));
  const interBank = fundTransfers.filter(t => t.description?.toLowerCase().includes('investment'));
  const crossBorder = fundTransfers.filter(t => t.description?.toLowerCase().includes('international'));
  // ATM withdrawals, POS purchases
  const atmWithdrawals = transactions.filter(t => t.type === 'withdrawal' && t.channel === 'ATM');
  const posPurchases = transactions.filter(t => t.channel === 'POS');
  // FX transactions
  const fxTransactions = transactions.filter(t => t.type === 'fx' || (t.description && t.description.toLowerCase().includes('currency exchange')));

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
            <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#374151' }}>Loading Transaction Behavior...</div>
            <div style={{ color: '#6b7280' }}>Analyzing client transaction patterns and behavior</div>
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
            <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#ef4444' }}>Error Loading Transaction Behavior</div>
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
            <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#ef4444' }}>
              Client Not Found
            </div>
            <div style={{ color: '#6b7280', marginBottom: 24 }}>
              The client with NRIC {nric} could not be found.
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
          clientName={client.name}
          clientStatus={client.status}
          clientRiskProfile={client.risk_profile}
          nric={nric}
          isMobile={isMobile}
        />
        
        <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 24 }}>Transaction Behavior</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Recent Transactions Summary */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 16 }}>Recent Transactions Summary (across products)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Total Transactions (30 days)</div>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#222' }}>{totalTransactions}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Total Volume</div>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#222' }}>RM {totalVolume.toLocaleString()}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Average Transaction</div>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#222' }}>RM {averageTransaction.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Most Active Day</div>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#222' }}>{mostActiveDay || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Categorised Spending */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 16 }}>Categorised Spending (e.g., groceries, travel, utilities)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
              {categorisedSpending.length > 0 ? (
                categorisedSpending.slice(0, 6).map((spending, index) => {
                  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
                  return (
                    <div key={spending.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: colors[index % colors.length] }}></div>
                        <span style={{ fontSize: 14, color: '#222' }}>{spending.category}</span>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 500, color: '#222' }}>RM {spending.amount.toLocaleString()}</span>
                    </div>
                  );
                })
              ) : (
                <div style={{ color: '#6b7280', fontStyle: 'italic' }}>No categorised spending data available</div>
              )}
            </div>
          </div>

          {/* Large or Unusual Transactions */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 16 }}>Large or Unusual Transactions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {unusualTransactions.length > 0 ? (
                unusualTransactions.map((transaction, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#fef3c7', borderRadius: 8, border: '1px solid #fde68a' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#92400e' }}>
                        {transaction.type === 'transfer' ? 'Large Transfer' : 'Unusual Spending'} - RM {transaction.amount.toLocaleString()}
                      </div>
                      <div style={{ fontSize: 12, color: '#b45309' }}>
                        {new Date(transaction.transaction_date).toLocaleDateString('en-GB')} • {transaction.description}
                      </div>
                    </div>
                    <span style={{ fontSize: 12, color: '#b45309', fontWeight: 500 }}>FLAGGED</span>
                  </div>
                ))
              ) : (
                <div style={{ color: '#6b7280', fontStyle: 'italic' }}>No large or unusual transactions found</div>
              )}
            </div>
          </div>

          {/* Fund Transfers */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 16 }}>Fund Transfers (Intra-bank, Inter-bank, Cross-border)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Intra-bank Transfers</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#222', marginBottom: 4 }}>{intraBank.length} transactions</div>
                <div style={{ fontSize: 14, color: '#6b7280' }}>Total: RM {intraBank.reduce((sum, t) => sum + Number(t.amount), 0).toLocaleString()}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Inter-bank Transfers</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#222', marginBottom: 4 }}>{interBank.length} transactions</div>
                <div style={{ fontSize: 14, color: '#6b7280' }}>Total: RM {interBank.reduce((sum, t) => sum + Number(t.amount), 0).toLocaleString()}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Cross-border Transfers</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#222', marginBottom: 4 }}>{crossBorder.length} transactions</div>
                <div style={{ fontSize: 14, color: '#6b7280' }}>Total: RM {crossBorder.reduce((sum, t) => sum + Number(t.amount), 0).toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* ATM Withdrawals, POS Purchases */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 16 }}>ATM Withdrawals, POS Purchases</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>ATM Withdrawals</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#222', marginBottom: 4 }}>{atmWithdrawals.length} transactions</div>
                <div style={{ fontSize: 14, color: '#6b7280' }}>Total: RM {atmWithdrawals.reduce((sum, t) => sum + Number(t.amount), 0).toLocaleString()}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>Avg: RM {atmWithdrawals.length > 0 ? (atmWithdrawals.reduce((sum, t) => sum + Number(t.amount), 0) / atmWithdrawals.length).toFixed(0) : 0} per withdrawal</div>
              </div>
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>POS Purchases</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#222', marginBottom: 4 }}>{posPurchases.length} transactions</div>
                <div style={{ fontSize: 14, color: '#6b7280' }}>Total: RM {posPurchases.reduce((sum, t) => sum + Number(t.amount), 0).toLocaleString()}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>Avg: RM {posPurchases.length > 0 ? (posPurchases.reduce((sum, t) => sum + Number(t.amount), 0) / posPurchases.length).toFixed(0) : 0} per purchase</div>
              </div>
            </div>
          </div>

          {/* FX Transactions or Cross-border Activity */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 16 }}>FX Transactions or Cross-border Activity</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {fxTransactions.length > 0 ? (
                fxTransactions.map((transaction, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f0f9ff', borderRadius: 8, border: '1px solid #bae6fd' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#0c4a6e' }}>
                        {transaction.type === 'fx' ? 'Currency Exchange' : 'Cross-border'} - {transaction.currency || 'MYR'}
                      </div>
                      <div style={{ fontSize: 12, color: '#0369a1' }}>
                        {new Date(transaction.transaction_date).toLocaleDateString('en-GB')} • Amount: RM {transaction.amount.toLocaleString()} • {transaction.description}
                      </div>
                    </div>
                    <span style={{ fontSize: 12, color: '#0369a1', fontWeight: 500 }}>
                      FX
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ color: '#6b7280', fontStyle: 'italic' }}>No FX or cross-border transactions found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 