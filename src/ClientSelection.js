import React, { useState, useEffect } from "react";
import { FaCog, FaPlus, FaEllipsisH, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { deleteClientCompletely } from './utils/clientDeletion';



const validateNRIC = (nric) => /^\d{6}-\d{2}-\d{4}$/.test(nric);

// Utility for NRIC formatting
function formatNRICInput(value) {
  let digits = value.replace(/\D/g, '');
  if (digits.length > 12) digits = digits.slice(0, 12);
  let formatted = digits;
  if (digits.length > 6) {
    formatted = digits.slice(0, 6) + '-' + digits.slice(6);
  }
  if (digits.length > 8) {
    formatted = formatted.slice(0, 9) + '-' + formatted.slice(9);
  }
  return formatted;
}

export default function ClientSelection({ user, onLogout }) {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClient, setNewClient] = useState({
    nric: '',
    name: '',
    email: '',
    status: 'Active',
    risk_profile: 'Moderate'
  });
  const [nricError, setNricError] = useState('');
  const [openMenu, setOpenMenu] = useState(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load clients from Supabase
  useEffect(() => {
    const loadClients = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('nric');

        console.log('Supabase response:', { data, error });
        
        if (error) {
          console.error('Error loading clients:', error);
          setClients([]);
        } else {
          console.log('Setting clients:', data);
          setClients(data || []);
        }
      } catch (err) {
        console.error('Error loading clients:', err);
        setClients([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenu !== null) {
        setOpenMenu(null);
      }
    };

    if (openMenu !== null) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openMenu]);

  // Loading state
  if (isLoading) {
    return (
      <div style={{ background: '#f6f7f9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#374151' }}>Loading Client List...</div>
          <div style={{ color: '#6b7280' }}>Fetching client information from database</div>
        </div>
      </div>
    );
  }

  const handleClientSelect = (clientId) => {
    navigate(`/dashboard/${clientId}`);
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    if (!validateNRIC(newClient.nric)) {
      setNricError('Invalid NRIC format (e.g. 900101-14-5678)');
      return;
    }
    setNricError('');
    if (newClient.name && newClient.email && newClient.nric) {
      // Check uniqueness
      const { data: existing, error: checkError } = await supabase
        .from('clients')
        .select('nric')
        .eq('nric', newClient.nric)
        .single();
      if (existing) {
        setNricError('A client with this NRIC already exists.');
        return;
      }
      
      setIsAddingClient(true);
      
      try {
        console.log('Adding new client:', newClient);
        
        // Insert the client first
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .insert([{ ...newClient }])
          .select()
          .single();
          
        if (clientError) {
          console.error('Error adding client:', clientError);
          alert('Error adding client');
          setIsAddingClient(false);
          return;
        }
        
        console.log('Client added successfully:', clientData);
        
        // Generate default data for the new client
        const clientNric = newClient.nric;
        const defaultAssets = Math.floor(Math.random() * 500000) + 300000; // Random assets between 300k-800k
        const defaultCashflow = Math.floor(defaultAssets * 0.04); // 4% of assets as cashflow
        
        // Create default dashboard metrics
        const { error: dashboardError } = await supabase
          .from('dashboard_metrics')
          .insert([{
            client_nric: clientNric,
            assets: defaultAssets,
            cashflow: defaultCashflow,
            monthly_cashflow: Array(12).fill(0).map(() => Math.floor(Math.random() * 5000) + 3000),
            account_balances: {
              casa: Math.floor(defaultAssets * 0.1),
              fd: Math.floor(defaultAssets * 0.3),
              loans: Math.floor(defaultAssets * 0.4),
              cards: Math.floor(defaultAssets * 0.02)
            },
            transactions_heatmap: Array(12).fill(0).map(() => Math.floor(Math.random() * 20) + 5),
            months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
          }]);
          
        if (dashboardError) {
          console.error('Error creating dashboard metrics:', dashboardError);
        } else {
          console.log('Dashboard metrics created for:', clientNric);
        }
        
        // Create default financial summary
        const { error: financialError } = await supabase
          .from('financial_summary')
          .insert([{
            client_nric: clientNric,
            net_worth: defaultAssets,
            monthly_cashflow: {
              months: ["Jan", "Feb", "Mar"],
              inflow: Array(3).fill(0).map(() => Math.floor(Math.random() * 5000) + 3000)
            },
            asset_utilization: Math.floor(Math.random() * 30) + 60, // 60-90%
            assets_breakdown: {
              labels: ["Property", "Stocks", "Cash"],
              data: [
                Math.floor(defaultAssets * 0.6),
                Math.floor(defaultAssets * 0.25),
                Math.floor(defaultAssets * 0.15)
              ]
            },
            liabilities_breakdown: {
              labels: ["Mortgage", "Credit Card"],
              data: [
                Math.floor(defaultAssets * 0.3),
                Math.floor(defaultAssets * 0.02)
              ]
            }
          }]);
          
        if (financialError) {
          console.error('Error creating financial summary:', financialError);
        } else {
          console.log('Financial summary created for:', clientNric);
        }
        
        // Create default transaction behavior
        const { error: transactionError } = await supabase
          .from('transaction_behavior')
          .insert([{
            client_nric: clientNric,
            casa_deposits: Array(3).fill(0).map(() => Math.floor(Math.random() * 1000) + 500),
            casa_withdrawals: Array(3).fill(0).map(() => Math.floor(Math.random() * 800) + 400),
            card_spending: Array(3).fill(0).map(() => Math.floor(Math.random() * 600) + 300),
            card_payments: Array(3).fill(0).map(() => Math.floor(Math.random() * 500) + 200)
          }]);
          
        if (transactionError) {
          console.error('Error creating transaction behavior:', transactionError);
        } else {
          console.log('Transaction behavior created for:', clientNric);
        }
        
        // Create default investments portfolio
        const { error: investmentsError } = await supabase
          .from('investments_portfolio')
          .insert([{
            client_nric: clientNric,
            holdings: [
              {
                asset: "Stock Portfolio",
                type: "Stock",
                balance: Math.floor(defaultAssets * 0.2)
              },
              {
                asset: "Bond Fund",
                type: "Bond",
                balance: Math.floor(defaultAssets * 0.1)
              }
            ]
          }]);
          
        if (investmentsError) {
          console.error('Error creating investments portfolio:', investmentsError);
        } else {
          console.log('Investments portfolio created for:', clientNric);
        }
        
        // Create default liabilities and credit
        const { error: liabilitiesError } = await supabase
          .from('liabilities_credit')
          .insert([{
            client_nric: clientNric,
            liabilities: [
              {
                name: "Home Loan",
                type: "Mortgage",
                balance: Math.floor(defaultAssets * 0.3)
              }
            ],
            credit_lines: [
              {
                name: "Credit Card",
                type: "Credit Card",
                limit: Math.floor(defaultAssets * 0.02)
              }
            ]
          }]);
          
        if (liabilitiesError) {
          console.error('Error creating liabilities and credit:', liabilitiesError);
        } else {
          console.log('Liabilities and credit created for:', clientNric);
        }
        
        // Update the clients list
        setClients([...clients, clientData]);
        setNewClient({ nric: '', name: '', email: '', status: 'Active', risk_profile: 'Moderate' });
        setShowAddForm(false);
        
        // Show success message
        setSuccessMessage(`✅ Client "${clientData.name}" created successfully with complete financial data!`);
        setTimeout(() => setSuccessMessage(''), 5000); // Clear after 5 seconds
        
        console.log('✅ New client and all related data created successfully!');
        
      } catch (err) {
        console.error('Error adding client:', err);
        alert('Error adding client: ' + err.message);
      } finally {
        setIsAddingClient(false);
      }
    }
  };

  const handleRemoveClient = async (clientNric) => {
    const client = clients.find(c => c.nric === clientNric);
    const clientName = client ? client.name : clientNric;
    
    const confirmationMessage = `Are you sure you want to remove "${clientName}" (${clientNric})?\n\nThis will permanently delete ALL data including:\n• Financial assets and liabilities\n• Monthly cash flow records\n• Product holdings and investments\n• Credit utilization data\n• Risk indicators and assessments\n• Transaction behavior data\n• Financial trends and charts\n• Emergency fund analysis\n• And all other related financial data\n\nThis action cannot be undone.`;
    
    if (window.confirm(confirmationMessage)) {
      try {
        console.log('Removing client and all related data:', clientNric);
        
        // Use the comprehensive deletion utility
        const result = await deleteClientCompletely(clientNric);
        
        if (result.success) {
          console.log('✓ Client removed successfully');
          setClients(clients.filter(client => client.nric !== clientNric));
          setOpenMenu(null);
          
          // Show success message
          setSuccessMessage(`✅ Client removed successfully! All related data (${result.deletedTables.length} tables) has been deleted.`);
          setTimeout(() => setSuccessMessage(''), 5000); // Clear after 5 seconds
        } else {
          console.error('Error removing client:', result.error);
          alert('Error removing client: ' + result.error);
        }
      } catch (err) {
        console.error('Error removing client:', err);
        alert('Error removing client: ' + err.message);
      }
    }
  };

  const toggleMenu = (clientNric, e) => {
    e.stopPropagation();
    setOpenMenu(openMenu === clientNric ? null : clientNric);
  };

  // Filter clients by search
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.nric.toLowerCase().includes(search.toLowerCase())
  );



  return (
    <div style={{ minHeight: "100vh", background: "#f6f7f9" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "32px",
        background: "#fff",
        borderBottom: "1px solid #e5e7eb"
      }}>
        <div>
          <span style={{ fontSize: 28, fontWeight: 700 }}>Select Client</span>
          <div style={{ marginTop: 8, color: "#555" }}>
            Choose a client to view their 360° overview
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            style={{
              background: '#222',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '8px 16px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
            onClick={() => setShowAddForm(true)}
          >
            <FaPlus size={14} />
            Add Client
          </button>
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 28, color: '#222' }}
            title="Settings"
            onClick={() => navigate('/settings')}
          >
            <FaCog />
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div style={{
          background: '#dcfce7',
          color: '#166534',
          padding: '12px 32px',
          borderBottom: '1px solid #bbf7d0',
          fontSize: 14,
          fontWeight: 500
        }}>
          {successMessage}
        </div>
      )}

      {/* Search Bar */}
      <div style={{ background: '#fff', padding: '24px 32px 0 32px', borderBottom: '1px solid #e5e7eb' }}>
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            Loading clients...
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', background: '#f6f8fc', borderRadius: 8, border: '1px solid #e5e7eb', padding: '0 12px', marginBottom: 16 }}>
          <FaSearch style={{ color: '#374151', fontSize: 18, marginRight: 8 }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clients by NRIC or name..."
            style={{
              width: '100%',
              padding: '12px 0',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 16,
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Add Client Form */}
      {showAddForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: 32,
            minWidth: 400,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }}>
            <h3 style={{ marginBottom: 24, fontWeight: 600 }}>Add New Client</h3>
            <form onSubmit={handleAddClient}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Name:</label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>NRIC:</label>
                <input
                  type="text"
                  value={newClient.nric}
                  onChange={(e) => {
                    const formatted = formatNRICInput(e.target.value);
                    setNewClient({ ...newClient, nric: formatted });
                    setNricError(validateNRIC(formatted) ? '' : 'Invalid NRIC format (e.g. 900101-14-5678)');
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: nricError ? '1.5px solid #ef4444' : '1px solid #e5e7eb',
                    borderRadius: 8
                  }}
                  maxLength={14}
                  placeholder="XXXXXX-XX-XXXX"
                  required
                />
                {nricError && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{nricError}</div>}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Email:</label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    fontSize: 14
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Status:</label>
                <select
                  value={newClient.status}
                  onChange={(e) => setNewClient({...newClient, status: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    fontSize: 14
                  }}
                >
                  <option value="Active">Active</option>
                  <option value="Dormant">Dormant</option>
                  <option value="High Risk">High Risk</option>
                </select>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Risk Profile:</label>
                <select
                  value={newClient.risk_profile}
                  onChange={(e) => setNewClient({...newClient, risk_profile: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    fontSize: 14
                  }}
                >
                  <option value="Conservative">Conservative</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Aggressive">Aggressive</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="submit"
                  disabled={isAddingClient}
                  style={{
                    background: isAddingClient ? '#9ca3af' : '#222',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '12px 24px',
                    fontWeight: 500,
                    cursor: isAddingClient ? 'not-allowed' : 'pointer',
                    flex: 1,
                    opacity: isAddingClient ? 0.7 : 1
                  }}
                >
                  {isAddingClient ? 'Creating Client...' : 'Add Client'}
                </button>
                <button
                  type="button"
                  style={{
                    background: '#e5e7eb',
                    color: '#222',
                    border: 'none',
                    borderRadius: 6,
                    padding: '12px 24px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    flex: 1
                  }}
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main style={{ padding: 32 }}>
        {/* Client Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {filteredClients.length === 0 && !isLoading ? (
            <div style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "60px 20px",
              background: "#fff",
              borderRadius: 16,
              border: "2px dashed #e5e7eb"
            }}>
              <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: "#374151" }}>
                {search ? 'No clients found' : 'No clients available'}
              </div>
              <div style={{ color: "#6b7280", marginBottom: 24 }}>
                {search ? 'Try adjusting your search terms' : 'Add your first client to get started'}
              </div>
              {!search && (
                <button
                  style={{
                    background: '#222',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '12px 24px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                  onClick={() => setShowAddForm(true)}
                >
                  Add First Client
                </button>
              )}
            </div>
                    ) : (
            filteredClients.map((client) => (
            <div
              key={client.nric}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 24,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                border: "1px solid #e5e7eb",
                position: "relative"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
              }}
                              onClick={() => handleClientSelect(client.nric)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 4px 0" }}>{client.name}</h3>
                  <p style={{ color: "#666", margin: 0, fontSize: 14 }}>{client.nric}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    background: client.status === "Active" ? "#dcfce7" : "#fef3c7",
                    color: client.status === "Active" ? "#166534" : "#92400e",
                    borderRadius: 12,
                    padding: "4px 12px",
                    fontSize: 12,
                    fontWeight: 500
                  }}>
                    {client.status}
                  </span>
                  {/* Three Dots Menu */}
                  <div style={{ position: 'relative' }}>
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#666',
                        padding: '4px',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                                                  onClick={(e) => toggleMenu(client.nric, e)}
                      title="More options"
                    >
                      <FaEllipsisH size={12} />
                    </button>
                    {/* Dropdown Menu */}
                    {openMenu === client.nric && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        background: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: 8,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 100,
                        minWidth: 120
                      }}>
                        <button
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            background: 'none',
                            border: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            color: '#dc2626',
                            fontSize: 14
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveClient(client.nric);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#666", fontSize: 14 }}>
                  Risk Profile: <strong>{client.risk_profile}</strong>
                </span>
              </div>
            </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
} 