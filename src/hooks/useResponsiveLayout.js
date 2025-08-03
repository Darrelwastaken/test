import { useState, useEffect } from 'react';

export const useResponsiveLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      
      const mobile = width <= 768;
      const tablet = width > 768 && width <= 1024;
      const desktop = width > 1024;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      setIsDesktop(desktop);
      
      // Auto-close sidebar on desktop
      if (desktop) {
        setSidebarOpen(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const getMainContentStyle = () => {
    if (isMobile) {
      return {
        marginLeft: 0,
        padding: '16px 16px 16px 70px',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        transition: 'margin-left 0.3s ease',
      };
    }
    return {
      marginLeft: 240,
      padding: '32px',
      width: 'calc(100% - 240px)',
      maxWidth: 'calc(100% - 240px)',
      boxSizing: 'border-box',
      overflowX: 'hidden',
      transition: 'margin-left 0.3s ease',
    };
  };

  const getResponsiveGridStyle = (columns = 1) => {
    if (isMobile) {
      return {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '1rem',
      };
    } else if (isTablet) {
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(columns, 2)}, 1fr)`,
        gap: '1.5rem',
      };
    } else {
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '2rem',
      };
    }
  };

  const getResponsiveCardStyle = () => {
    if (isMobile) {
      return {
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '0.75rem',
        marginBottom: '0.75rem',
      };
    }
    return {
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      padding: '1rem',
      marginBottom: '1rem',
    };
  };

  const getResponsiveButtonStyle = (variant = 'primary') => {
    const baseStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textDecoration: 'none',
    };

    const variants = {
      primary: {
        background: '#222',
        color: '#fff',
      },
      secondary: {
        background: '#e5e7eb',
        color: '#222',
      },
      success: {
        background: '#10b981',
        color: '#fff',
      },
      danger: {
        background: '#ef4444',
        color: '#fff',
      },
    };

    if (isMobile) {
      return {
        ...baseStyle,
        ...variants[variant],
        padding: '0.75rem 1rem',
        fontSize: '1rem',
        minHeight: '48px',
        minWidth: '44px',
      };
    }

    return {
      ...baseStyle,
      ...variants[variant],
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      minHeight: '44px',
    };
  };

  const getResponsiveInputStyle = () => {
    if (isMobile) {
      return {
        width: '100%',
        padding: '0.875rem',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '16px', // Prevents zoom on iOS
        fontFamily: 'inherit',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
      };
    }

    return {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '1rem',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s',
    };
  };

  const getResponsiveTableStyle = () => {
    if (isMobile) {
      return {
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
      };
    }
    return {};
  };

  const getResponsiveChartStyle = () => {
    if (isMobile) {
      return {
        height: '250px',
        width: '100%',
      };
    } else if (isTablet) {
      return {
        height: '300px',
        width: '100%',
      };
    }
    return {
      height: '350px',
      width: '100%',
    };
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  // Breakpoint utilities
  const breakpoints = {
    mobile: 768,
    tablet: 1024,
    desktop: 1025,
  };

  const isBreakpoint = (breakpoint) => {
    return screenWidth <= breakpoints[breakpoint];
  };

  return {
    // State
    isMobile,
    isTablet,
    isDesktop,
    screenWidth,
    sidebarOpen,
    setSidebarOpen,
    
    // Actions
    toggleSidebar,
    closeSidebar,
    openSidebar,
    
    // Style generators
    getMainContentStyle,
    getResponsiveGridStyle,
    getResponsiveCardStyle,
    getResponsiveButtonStyle,
    getResponsiveInputStyle,
    getResponsiveTableStyle,
    getResponsiveChartStyle,
    
    // Breakpoint utilities
    breakpoints,
    isBreakpoint,
  };
}; 