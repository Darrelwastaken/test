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



  function handleSubmit(e) {
    e.preventDefault();
    let newErrors = {};
    if (!validateEmail(form.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!validatePassword(form.password)) {
      newErrors.password = 'Password must be at least 8 characters, include 1 number and 1 capital letter';
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === form.email)) {
      newErrors.email = 'Email is already registered';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      users.push({ email: form.email, password: form.password });
      localStorage.setItem('users', JSON.stringify(users));
      setSuccess('Sign up successful! Please log in.');
      setForm({ email: '', password: '' });
      if (onSuccess) onSuccess();
    }
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

          <button type="submit" style={{ 
            width: '100%',
            background: '#e5e7eb', 
            color: '#222', 
            border: 'none', 
            borderRadius: 8, 
            padding: '14px 24px', 
            fontWeight: 600, 
            fontSize: 16, 
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}>Sign Up</button>
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

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setSuccess('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    let newErrors = {};
    if (!validateEmail(form.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!form.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === form.email);
      if (!user) {
        setErrors({ email: 'No account found with this email' });
      } else if (user.password !== form.password) {
        setErrors({ password: 'Incorrect password' });
      } else {
        setSuccess('Login successful!');
        onLogin && onLogin(user);
      }
    }
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
          <button type="submit" style={{ 
            width: '100%',
            background: '#e5e7eb', 
            color: '#222', 
            border: 'none', 
            borderRadius: 8, 
            padding: '14px 24px', 
            fontWeight: 600, 
            fontSize: 16, 
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}>Login</button>
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
  if (!user) return <Navigate to="/" replace />;
  return (
    <Layout user={user} onLogout={onLogout}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, maxWidth: 400, margin: '0 auto', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <h2 style={{ fontWeight: 700, marginBottom: 16 }}>Settings</h2>
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Day of Birth:</strong> {user.dob}</div>
      </div>
    </Layout>
  );
}

function App() {
  const [loggedInUser, setLoggedInUser] = useState(() => {
    return JSON.parse(localStorage.getItem('loggedInUser') || 'null');
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
