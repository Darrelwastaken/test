import React from 'react';

export const LoadingState = ({ title, subtitle, showBackground = true, showSidebar = false, sidebarComponent = null, clientId = null }) => {
  const containerStyle = {
    background: showBackground ? '#f6f7f9' : 'transparent',
    minHeight: showBackground ? '100vh' : 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: showBackground ? 0 : '32px'
  };

  const contentStyle = {
    padding: showSidebar ? '32px' : '0',
    marginLeft: showSidebar ? '240px' : '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: showSidebar ? 'calc(100vh - 64px)' : 'auto',
    width: showSidebar ? 'calc(100% - 240px)' : '100%'
  };

  if (showSidebar && sidebarComponent) {
    return (
      <div style={{ background: '#f6f7f9', minHeight: '100vh' }}>
        {React.cloneElement(sidebarComponent, { clientId })}
        <div style={contentStyle}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#374151' }}>
              {title || 'Loading...'}
            </div>
            {subtitle && (
              <div style={{ color: '#6b7280' }}>
                {subtitle}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#374151' }}>
          {title || 'Loading...'}
        </div>
        {subtitle && (
          <div style={{ color: '#6b7280' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export const ErrorState = ({ title, message, onRetry, onBack, backText = 'Back to Client Selection', showSidebar = false, sidebarComponent = null, clientId = null }) => {
  const contentStyle = {
    padding: showSidebar ? '32px' : '0',
    marginLeft: showSidebar ? '240px' : '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: showSidebar ? 'calc(100vh - 64px)' : '100vh',
    width: showSidebar ? 'calc(100% - 240px)' : '100%'
  };

  if (showSidebar && sidebarComponent) {
    return (
      <div style={{ background: '#f6f7f9', minHeight: '100vh' }}>
        {React.cloneElement(sidebarComponent, { clientId })}
        <div style={contentStyle}>
          <div style={{ textAlign: 'center', background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#ef4444' }}>
              {title || 'Error'}
            </div>
            <div style={{ color: '#6b7280', marginBottom: 24 }}>
              {message}
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              {onRetry && (
                <button 
                  style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 500, cursor: 'pointer' }}
                  onClick={onRetry}
                >
                  Retry
                </button>
              )}
              {onBack && (
                <button 
                  style={{ background: '#e5e7eb', color: '#222', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 500, cursor: 'pointer' }}
                  onClick={onBack}
                >
                  {backText}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f6f7f9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#ef4444' }}>
          {title || 'Error'}
        </div>
        <div style={{ color: '#6b7280', marginBottom: 24 }}>
          {message}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          {onRetry && (
            <button 
              style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 500, cursor: 'pointer' }}
              onClick={onRetry}
            >
              Retry
            </button>
          )}
          {onBack && (
            <button 
              style={{ background: '#e5e7eb', color: '#222', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 500, cursor: 'pointer' }}
              onClick={onBack}
            >
              {backText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const NotFoundState = ({ title, message, onBack, backText = 'Back to Client Selection', showSidebar = false, sidebarComponent = null, clientId = null }) => {
  const contentStyle = {
    padding: showSidebar ? '32px' : '0',
    marginLeft: showSidebar ? '240px' : '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: showSidebar ? 'calc(100vh - 64px)' : '100vh',
    width: showSidebar ? 'calc(100% - 240px)' : '100%'
  };

  if (showSidebar && sidebarComponent) {
    return (
      <div style={{ background: '#f6f7f9', minHeight: '100vh' }}>
        {React.cloneElement(sidebarComponent, { clientId })}
        <div style={contentStyle}>
          <div style={{ textAlign: 'center', background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#ef4444' }}>
              {title || 'Not Found'}
            </div>
            <div style={{ color: '#6b7280', marginBottom: 24 }}>
              {message}
            </div>
            {onBack && (
              <button 
                style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 500, cursor: 'pointer' }}
                onClick={onBack}
              >
                {backText}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f6f7f9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#ef4444' }}>
          {title || 'Not Found'}
        </div>
        <div style={{ color: '#6b7280', marginBottom: 24 }}>
          {message}
        </div>
        {onBack && (
          <button 
            style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 500, cursor: 'pointer' }}
            onClick={onBack}
          >
            {backText}
          </button>
        )}
      </div>
    </div>
  );
}; 