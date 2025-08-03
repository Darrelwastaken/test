import React from 'react';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';

const ResponsiveTable = ({ 
  data, 
  columns, 
  onRowClick, 
  className = '', 
  style = {},
  emptyMessage = 'No data available'
}) => {
  const { isMobile, getResponsiveTableStyle } = useResponsiveLayout();

  if (!data || data.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#6b7280',
        fontSize: isMobile ? '14px' : '16px'
      }}>
        {emptyMessage}
      </div>
    );
  }

  if (isMobile) {
    // Mobile: Stack data vertically
    return (
      <div style={{ ...getResponsiveTableStyle(), ...style }} className={className}>
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              background: '#fff',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '0.75rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              cursor: onRowClick ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
            }}
            onClick={() => onRowClick && onRowClick(row, rowIndex)}
            onMouseEnter={(e) => {
              if (onRowClick) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (onRowClick) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }
            }}
          >
            {columns.map((column, colIndex) => (
              <div
                key={colIndex}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0',
                  borderBottom: colIndex < columns.length - 1 ? '1px solid #f3f4f6' : 'none',
                }}
              >
                <span style={{
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.875rem',
                  minWidth: '80px'
                }}>
                  {column.header}:
                </span>
                <span style={{
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  textAlign: 'right',
                  flex: 1,
                  wordBreak: 'break-word'
                }}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Desktop: Traditional table
  return (
    <div style={{ ...getResponsiveTableStyle(), ...style }} className={className}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        background: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <thead>
          <tr style={{ background: '#f9fafb' }}>
            {columns.map((column, index) => (
              <th
                key={index}
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.875rem',
                  borderBottom: '1px solid #e5e7eb'
                }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              style={{
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background-color 0.2s ease',
              }}
              onClick={() => onRowClick && onRowClick(row, rowIndex)}
              onMouseEnter={(e) => {
                if (onRowClick) {
                  e.target.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (onRowClick) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid #f3f4f6',
                    color: '#6b7280',
                    fontSize: '0.875rem'
                  }}
                >
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponsiveTable; 