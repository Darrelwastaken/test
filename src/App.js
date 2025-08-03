import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate
} from 'react-router-dom';
import React, { useState } from 'react';
import { FaCog } from 'react-icons/fa';
import Dashboard from './Dashboard';
import ClientSelection from './ClientSelection';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse } from 'date-fns';
import FinancialSummary from './FinancialSummary';
import ProductRecommendations from './ProductRecommendations';
import ProductsPage from './ProductsPage';
import EditProductsPage from './EditProductsPage';
import AddProductPage from './AddProductPage';
import TransactionBehavior from './TransactionBehavior';
import LiabilitiesCredit from './LiabilitiesCredit';
import InvestmentsPortfolio from './InvestmentsPortfolio';
import ProposalGenerator from './ProposalGenerator';
import DocumentsReports from './DocumentsReports';
import EditClientInfo from './EditClientInfoNew';
import { testDatabaseConnection } from './utils/testDatabaseConnection';
import { authService } from './services/authService';

const datePickerInputStyle = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid #d1d5db',
  borderRadius: 8,
  fontSize: 14,
  fontFamily: 'inherit',
  background: '#f6f8fc',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
  outline: 'none',
};

function Layout({ children, user, onLogout }) {
  const sidebarItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Financial Summary' },
    { label: 'Product Recommendations' },
    { label: 'Transaction Behavior' },
    { label: 'Investments & Portfolio' },
    { label: 'Liabilities & Credit' },
    { label: 'Proposal Generator' },
    { label: 'Documents & Reports' },
    { label: 'Settings', path: '/settings', show: !!user },
  ];
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f6f7f9' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: '#fff',
        borderRight: '1px solid #e5e7eb',
        padding: '32px 0 0 0'
      }}>
        <div style={{ fontWeight: 700, fontSize: 22, padding: '0 32px 32px' }}>
          Client 360 Overview
        </div>
        <nav>
          {sidebarItems.filter(i => i.show === undefined || i.show).map((item, idx) => (
            item.path ? (
              <Link
                key={item.label}
                to={item.path}
                style={{
                  display: 'block',
                  padding: '12px 32px',
                  background: window.location.pathname === item.path ? '#e5e7eb' : 'transparent',
                  fontWeight: window.location.pathname === item.path ? 600 : 400,
                  borderLeft: window.location.pathname === item.path ? '4px solid #222' : '4px solid transparent',
                  color: '#222',
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
              >
                {item.label}
              </Link>
            ) : (
              <div
                key={item.label}
                style={{
                  padding: '12px 32px',
                  color: '#222',
                  opacity: 0.7
                }}
              >
                {item.label}
              </div>
            )
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main style={{ flex: 1, padding: 32 }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 32
        }}>
          <div>
            <span style={{ fontSize: 28, fontWeight: 700 }}>{user ? user.email : 'Welcome'}</span>
          </div>
          <div>
            {user && (
              <button style={{
                background: '#222',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 16px',
                fontWeight: 500,
                cursor: 'pointer'
              }} onClick={onLogout}>Logout</button>
            )}
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

function HomeLanding() {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f6f7f9' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 48, minWidth: 400, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', textAlign: 'center' }}>
        <h1 style={{ fontWeight: 700, marginBottom: 32 }}>Welcome to Client 360</h1>
        <button style={{
          background: '#222', color: '#fff', border: 'none', borderRadius: 6, padding: '16px 32px', fontWeight: 500, fontSize: 18, marginBottom: 16, cursor: 'pointer', width: '100%'
        }} onClick={() => navigate('/login')}>Login</button>
        <button style={{
          background: '#e5e7eb', color: '#222', border: 'none', borderRadius: 6, padding: '16px 32px', fontWeight: 500, fontSize: 18, cursor: 'pointer', width: '100%'
        }} onClick={() => navigate('/signup')}>Sign Up</button>
      </div>
    </div>
  );
}

function SignUp({ onSuccess, noLayout }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePassword(password) {
    return /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setSuccess('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    
    let newErrors = {};
    if (!validateEmail(form.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!validatePassword(form.password)) {
      newErrors.password = 'Password must be at least 8 characters, include 1 number and 1 capital letter';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      try {
        const result = await authService.register(form.email, form.password);
        
        if (result.success) {
          setSuccess('Sign up successful! Please log in.');
          setForm({ email: '', password: '' });
          if (onSuccess) onSuccess();
        } else {
          setErrors({ email: result.error });
        }
      } catch (error) {
        setErrors({ email: 'Registration failed. Please try again.' });
      }
    }
    
    setIsLoading(false);
  }

  return noLayout ? (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f6f7f9' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 48, minWidth: 400, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', textAlign: 'center', position: 'relative' }}>
        <button style={{ 
          position: 'absolute', 
          left: 24, 
          top: 24, 
          background: '#374151', 
          color: '#fff', 
          border: 'none', 
          borderRadius: 6, 
          padding: '8px 16px', 
          fontWeight: 500, 
          fontSize: 14, 
          cursor: 'pointer'
        }} onClick={() => navigate('/')}>Back</button>
        <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 32 }}>Sign Up</h2>
        <form onSubmit={handleSubmit} noValidate style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151', fontSize: 14 }}>Email:</label>
            <input 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              required 
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                fontSize: 14,
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              placeholder="Enter your email"
            />
            {errors.email && <div style={{color:'#dc2626', fontSize: 12, marginTop: 4}}>{errors.email}</div>}
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151', fontSize: 14 }}>Password:</label>
            <input 
              type="password" 
              name="password" 
              value={form.password} 
              onChange={handleChange} 
              required 
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                fontSize: 14,
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              placeholder="Enter your password"
            />
            {errors.password && <div style={{color:'#dc2626', fontSize: 12, marginTop: 4}}>{errors.password}</div>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              width: '100%',
              background: isLoading ? '#9ca3af' : '#e5e7eb', 
              color: '#222', 
              border: 'none', 
              borderRadius: 8, 
              padding: '14px 24px', 
              fontWeight: 600, 
              fontSize: 16, 
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
          {success && <div style={{color:'#059669', fontSize: 14, marginTop: 16, textAlign: 'center'}}>{success}</div>}
        </form>
      </div>
    </div>
  ) : (
    <Layout>
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, maxWidth: 400, margin: '0 auto', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 24 }}>Sign Up</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label>Email:</label><br />
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
            {errors.email && <div style={{color:'red'}}>{errors.email}</div>}
          </div>
          <div>
            <label>Password:</label><br />
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
            {errors.password && <div style={{color:'red'}}>{errors.password}</div>}
          </div>

          <button type="submit">Sign Up</button>
          {success && <div style={{color:'green'}}>{success}</div>}
        </form>
      </div>
    </Layout>
  );
}

function Login({ onLogin, noLayout }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setSuccess('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    
    let newErrors = {};
    if (!validateEmail(form.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!form.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      try {
        const result = await authService.login(form.email, form.password);
        
        if (result.success) {
          setSuccess('Login successful!');
          onLogin && onLogin(result.user);
        } else {
          // Determine which field to show the error on
          if (result.error.includes('No account found')) {
            setErrors({ email: result.error });
          } else if (result.error.includes('Incorrect password')) {
            setErrors({ password: result.error });
          } else {
            setErrors({ email: result.error });
          }
        }
      } catch (error) {
        setErrors({ email: 'Login failed. Please try again.' });
      }
    }
    
    setIsLoading(false);
  }

  return noLayout ? (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f6f7f9' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 48, minWidth: 400, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', textAlign: 'center', position: 'relative' }}>
        <button style={{ 
          position: 'absolute', 
          left: 24, 
          top: 24, 
          background: '#374151', 
          color: '#fff', 
          border: 'none', 
          borderRadius: 6, 
          padding: '8px 16px', 
          fontWeight: 500, 
          fontSize: 14, 
          cursor: 'pointer'
        }} onClick={() => navigate('/')}>Back</button>
        <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 32 }}>Login</h2>
        <form onSubmit={handleSubmit} noValidate style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151', fontSize: 14 }}>Email:</label>
            <input 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              required 
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                fontSize: 14,
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              placeholder="Enter your email"
            />
            {errors.email && <div style={{color:'#dc2626', fontSize: 12, marginTop: 4}}>{errors.email}</div>}
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151', fontSize: 14 }}>Password:</label>
            <input 
              type="password" 
              name="password" 
              value={form.password} 
              onChange={handleChange} 
              required 
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                fontSize: 14,
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              placeholder="Enter your password"
            />
            {errors.password && <div style={{color:'#dc2626', fontSize: 12, marginTop: 4}}>{errors.password}</div>}
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              width: '100%',
              background: isLoading ? '#9ca3af' : '#e5e7eb', 
              color: '#222', 
              border: 'none', 
              borderRadius: 8, 
              padding: '14px 24px', 
              fontWeight: 600, 
              fontSize: 16, 
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {isLoading ? 'Logging In...' : 'Login'}
          </button>
          {success && <div style={{color:'#059669', fontSize: 14, marginTop: 16, textAlign: 'center'}}>{success}</div>}
        </form>
      </div>
    </div>
  ) : (
    <Layout>
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, maxWidth: 400, margin: '0 auto', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 24 }}>Login</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label>Email:</label><br />
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
            {errors.email && <div style={{color:'red'}}>{errors.email}</div>}
          </div>
          <div>
            <label>Password:</label><br />
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
            {errors.password && <div style={{color:'red'}}>{errors.password}</div>}
          </div>
          <button type="submit">Login</button>
          {success && <div style={{color:'green'}}>{success}</div>}
        </form>
      </div>
    </Layout>
  );
}

function Settings({ user, onLogout }) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return <Navigate to="/" replace />;

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPasswordErrors({});
    setPasswordSuccess('');

    // Validation
    let errors = {};
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (!/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(passwordForm.newPassword)) {
      errors.newPassword = 'Password must be at least 8 characters, include 1 number and 1 capital letter';
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await authService.changePassword(user.id, passwordForm.currentPassword, passwordForm.newPassword);
      
      if (result.success) {
        setPasswordSuccess('Password updated successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordForm(false);
      } else {
        setPasswordErrors({ currentPassword: result.error });
      }
    } catch (error) {
      setPasswordErrors({ currentPassword: 'Failed to update password. Please try again.' });
    }

    setIsLoading(false);
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, maxWidth: 600, margin: '0 auto', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <h2 style={{ fontWeight: 700, marginBottom: 24 }}>Account Settings</h2>
        
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 16, color: '#374151' }}>Profile Information</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>Role:</strong> {user.role || 'User'}</div>
            <div><strong>Account Created:</strong> {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</div>
            <div><strong>Last Login:</strong> {user.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'}</div>
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 16, color: '#374151' }}>Security</h3>
          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              style={{
                background: '#222',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Change Password
            </button>
          ) : (
            <form onSubmit={handlePasswordChange} style={{ background: '#f9fafb', padding: 20, borderRadius: 8 }}>
              <h4 style={{ marginBottom: 16, fontWeight: 600 }}>Change Password</h4>
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Current Password:</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: 4,
                    fontSize: 14
                  }}
                />
                {passwordErrors.currentPassword && (
                  <div style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{passwordErrors.currentPassword}</div>
                )}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>New Password:</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: 4,
                    fontSize: 14
                  }}
                />
                {passwordErrors.newPassword && (
                  <div style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{passwordErrors.newPassword}</div>
                )}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Confirm New Password:</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: 4,
                    fontSize: 14
                  }}
                />
                {passwordErrors.confirmPassword && (
                  <div style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{passwordErrors.confirmPassword}</div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    background: isLoading ? '#9ca3af' : '#222',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 16px',
                    fontWeight: 500,
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordErrors({});
                    setPasswordSuccess('');
                  }}
                  style={{
                    background: '#e5e7eb',
                    color: '#222',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 16px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>

              {passwordSuccess && (
                <div style={{ color: '#059669', fontSize: 14, marginTop: 12 }}>{passwordSuccess}</div>
              )}
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

function App() {
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const savedUser = localStorage.getItem('loggedInUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = window.ReactRouterDOM ? window.ReactRouterDOM.useNavigate() : null;

  // Test database connection on app startup
  React.useEffect(() => {
    testDatabaseConnection();
  }, []);

  function handleLogin(user) {
    setLoggedInUser(user);
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    if (navigate) navigate('/clients');
    else window.location.hash = '#/clients';
  }

  function handleLogout() {
    setLoggedInUser(null);
    localStorage.removeItem('loggedInUser');
    if (navigate) navigate('/');
    else window.location.hash = '#/';
  }

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp noLayout={!loggedInUser} onSuccess={() => navigate ? navigate('/') : window.location.hash = '#/'}/>} />
        <Route path="/login" element={loggedInUser ? <ClientSelection user={loggedInUser} onLogout={handleLogout} /> : <Login noLayout={!loggedInUser} onLogin={handleLogin} />} />
        <Route path="/settings" element={<Settings user={loggedInUser} onLogout={handleLogout} />} />
        <Route path="/clients" element={loggedInUser ? <ClientSelection user={loggedInUser} onLogout={handleLogout} /> : <Login noLayout={!loggedInUser} onLogin={handleLogin} />} />
        <Route path="/dashboard/:nric" element={loggedInUser ? <Dashboard user={loggedInUser} /> : <Login noLayout={!loggedInUser} onLogin={handleLogin} />} />
        <Route path="/dashboard" element={loggedInUser ? <ClientSelection user={loggedInUser} onLogout={handleLogout} /> : <Login noLayout={!loggedInUser} onLogin={handleLogin} />} />
        <Route path="/financial-summary/:nric" element={<FinancialSummary />} />
        <Route path="/product-recommendations/:nric" element={<ProductRecommendations />} />
        <Route path="/products/:nric" element={<ProductsPage />} />
        <Route path="/edit-products/:nric" element={<EditProductsPage />} />
        <Route path="/add-product/:nric" element={<AddProductPage />} />
        <Route path="/transaction-behavior/:nric" element={<TransactionBehavior />} />
        <Route path="/liabilities-credit/:nric" element={<LiabilitiesCredit />} />
        <Route path="/investments-portfolio/:nric" element={<InvestmentsPortfolio />} />
        <Route path="/proposal-generator/:nric" element={<ProposalGenerator />} />
        <Route path="/documents-reports/:nric" element={<DocumentsReports />} />
        <Route path="/edit-client-info/:nric" element={<EditClientInfo />} />
        <Route path="/" element={loggedInUser ? <ClientSelection user={loggedInUser} onLogout={handleLogout} /> : <HomeLanding />} />
      </Routes>
    </Router>
  );
}

export default App;
