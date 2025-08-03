import React from 'react';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';

const ResponsiveChart = ({ 
  children, 
  title, 
  className = '', 
  style = {},
  showLegend = true,
  height = null
}) => {
  const { isMobile, getResponsiveChartStyle } = useResponsiveLayout();

  const chartStyle = {
    ...getResponsiveChartStyle(),
    ...style,
    ...(height && { height })
  };

  return (
    <div 
      className={`chart-container ${className}`}
      style={chartStyle}
    >
      {title && (
        <div style={{
          fontSize: isMobile ? '1rem' : '1.125rem',
          fontWeight: '600',
          color: '#374151',
          marginBottom: isMobile ? '0.75rem' : '1rem',
          textAlign: isMobile ? 'center' : 'left'
        }}>
          {title}
        </div>
      )}
      <div style={{
        position: 'relative',
        height: '100%',
        width: '100%'
      }}>
        {React.cloneElement(children, {
          options: {
            ...children.props.options,
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              ...children.props.options?.plugins,
              legend: {
                ...children.props.options?.plugins?.legend,
                display: showLegend && !isMobile, // Hide legend on mobile to save space
                position: isMobile ? 'bottom' : 'top',
                labels: {
                  ...children.props.options?.plugins?.legend?.labels,
                  boxWidth: isMobile ? 12 : 16,
                  boxHeight: isMobile ? 6 : 8,
                  padding: isMobile ? 8 : 12,
                  font: {
                    size: isMobile ? 11 : 13
                  }
                }
              },
              tooltip: {
                ...children.props.options?.plugins?.tooltip,
                titleFont: {
                  size: isMobile ? 12 : 14
                },
                bodyFont: {
                  size: isMobile ? 11 : 13
                },
                padding: isMobile ? 8 : 12
              }
            },
            scales: {
              ...children.props.options?.scales,
              x: {
                ...children.props.options?.scales?.x,
                ticks: {
                  ...children.props.options?.scales?.x?.ticks,
                  font: {
                    size: isMobile ? 10 : 12
                  },
                  maxRotation: isMobile ? 45 : 0
                },
                grid: {
                  ...children.props.options?.scales?.x?.grid,
                  display: !isMobile // Hide grid on mobile for cleaner look
                }
              },
              y: {
                ...children.props.options?.scales?.y,
                ticks: {
                  ...children.props.options?.scales?.y?.ticks,
                  font: {
                    size: isMobile ? 10 : 12
                  }
                },
                grid: {
                  ...children.props.options?.scales?.y?.grid,
                  display: !isMobile
                }
              }
            }
          }
        })}
      </div>
    </div>
  );
};

export default ResponsiveChart; 