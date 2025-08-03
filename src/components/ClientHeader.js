import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';

export default function ClientHeader({ 
  clientName, 
  clientStatus, 
  clientRiskProfile, 
  nric, 
  isMobile,
  showEditButton = true,
  showCrmButton = true,
  showSettingsButton = true,
  editButtonText = "Edit Client Info",
  crmButtonText = "View CRM Notes"
}) {
  const navigate = useNavigate();

  return (
    <div style={{
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      alignItems: isMobile ? "flex-start" : "center",
      marginBottom: 32,
      gap: isMobile ? 16 : 0
    }}>
      <div>
        <span style={{ fontSize: isMobile ? 24 : 28, fontWeight: 700 }}>
          {clientName || 'Client Not Found'}
        </span>
        {clientStatus && (
          <span style={{
            marginLeft: isMobile ? 12 : 16,
            background: clientStatus === 'Dormant' ? '#fde68a' : clientStatus === 'High Risk' ? '#fecaca' : '#e5e7eb',
            color: clientStatus === 'Dormant' ? '#b45309' : clientStatus === 'High Risk' ? '#b91c1c' : '#222',
            borderRadius: 8,
            padding: '4px 12px',
            fontWeight: 500,
            fontSize: isMobile ? 14 : 16
          }}>
            {clientStatus}
          </span>
        )}
        <div style={{ marginTop: 8, color: "#555", fontSize: isMobile ? 14 : 16 }}>
          {clientRiskProfile ? (
            <>
              Risk Profile <b>{clientRiskProfile}</b> &nbsp;|&nbsp; Priority
            </>
          ) : null}
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? 12 : 16,
        flexWrap: isMobile ? 'wrap' : 'nowrap'
      }}>
        {showEditButton && (
          <button
            onClick={() => navigate(`/edit-client-info/${nric}`)}
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: isMobile ? "10px 16px" : "8px 16px",
              fontWeight: 500,
              cursor: "pointer",
              fontSize: isMobile ? 14 : 16
            }}
          >
            {isMobile ? 'Edit' : editButtonText}
          </button>
        )}
        
        {showCrmButton && (
          <button
            style={{
              background: "#222",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: isMobile ? "10px 16px" : "8px 16px",
              fontWeight: 500,
              cursor: "pointer",
              fontSize: isMobile ? 14 : 16
            }}
          >
            {isMobile ? 'CRM Notes' : crmButtonText}
          </button>
        )}
        
        {showSettingsButton && (
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: isMobile ? 24 : 28,
              color: '#222'
            }}
            title="Settings"
            onClick={() => navigate('/settings')}
          >
            <FaCog />
          </button>
        )}
      </div>
    </div>
  );
} 