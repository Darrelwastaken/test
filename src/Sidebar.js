import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const sidebarItems = [
  'Dashboard',
  'Financial Summary',
  'Product Recommendations',
  'Transaction Behavior',
  'Investments & Portfolio',
  'Liabilities & Credit',
  'Proposal Generator',
  'Documents & Reports',
];

export default function Sidebar({ clientId }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Ensure clientId is available
  if (!clientId) {
    console.warn('Sidebar: clientId is required');
    return null;
  }

  return (
    <aside style={{
      width: 240,
      background: '#fff',
      borderRight: '1px solid #e5e7eb',
      padding: '32px 0 0 0',
      position: 'fixed',
      left: 0,
      top: 0,
      height: '100vh',
      overflow: 'hidden',
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 22, padding: '0 32px 32px' }}>
          Client 360 Overview
        </div>
        <nav>
          {sidebarItems.map((item, idx) => {
            let isActive = false;
            let onClick = () => {};
            if (item === 'Dashboard') {
              isActive = location.pathname === `/dashboard/${clientId}`;
              onClick = () => navigate(`/dashboard/${clientId}`);
            } else if (item === 'Financial Summary') {
              isActive = location.pathname === `/financial-summary/${clientId}`;
              onClick = () => navigate(`/financial-summary/${clientId}`);
            } else if (item === 'Product Recommendations') {
              isActive = location.pathname === `/product-recommendations/${clientId}`;
              onClick = () => navigate(`/product-recommendations/${clientId}`);
            } else if (item === 'Transaction Behavior') {
              isActive = location.pathname === `/transaction-behavior/${clientId}`;
              onClick = () => navigate(`/transaction-behavior/${clientId}`);
            } else if (item === 'Investments & Portfolio') {
              isActive = location.pathname === `/investments-portfolio/${clientId}`;
              onClick = () => navigate(`/investments-portfolio/${clientId}`);
            } else if (item === 'Liabilities & Credit') {
              isActive = location.pathname === `/liabilities-credit/${clientId}`;
              onClick = () => navigate(`/liabilities-credit/${clientId}`);
            } else if (item === 'Proposal Generator') {
              isActive = location.pathname === `/proposal-generator/${clientId}`;
              onClick = () => navigate(`/proposal-generator/${clientId}`);
            } else if (item === 'Documents & Reports') {
              isActive = location.pathname === `/documents-reports/${clientId}`;
              onClick = () => navigate(`/documents-reports/${clientId}`);
            }
            return (
              <div
                key={item}
                style={{
                  padding: '12px 32px',
                  background: isActive ? '#e5e7eb' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  borderLeft: isActive ? '4px solid #222' : '4px solid transparent',
                  color: '#222',
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onClick && typeof onClick === 'function') {
                    onClick();
                  }
                }}
                onMouseDown={(e) => e.preventDefault()}
                onMouseUp={(e) => e.preventDefault()}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.background = '#f3f4f6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                {item}
              </div>
            );
          })}
        </nav>
      </div>
      <div style={{ padding: '0 16px 48px 16px' }}>
        <button
          style={{
            width: '100%',
            background: '#e5e7eb',
            color: '#222',
            border: 'none',
            borderRadius: 6,
            padding: '12px 16px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 16,
            transition: 'all 0.2s ease',
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate('/clients');
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#d1d5db';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#e5e7eb';
          }}
        >
          Change Client
        </button>
      </div>
    </aside>
  );
} 