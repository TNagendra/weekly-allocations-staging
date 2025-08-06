
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SideNav from './components/SideNav/SideNav';
import AuthButton from './components/AuthButton';
import TimeAllocationPage from './routes/TimeAllocationPage';
import FilterTablePage from './routes/FilterTablePage';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [oauthError, setOauthError] = useState('');
  const allowedEmails = [
    'arati.misal@kloctechnologies.com',
    'shilpa.yadav@kloctechnologies.com',
    'pooja.h@kloctechnologies.com',
    'abhisarika.das@kloctechnologies.com',
    'sandra.shivadas@kloctechnologies.com',
    'chetna.vyas@kloctechnologies.com',
    'nagendra.t@kloctechnologies.com',
  ];
  const ProtectedRoute = ({ user, allowedEmails, children }) => {
    if (allowedEmails.includes(user?.email)) {
      return children;
    } else {
      return <Navigate to="/" replace />;
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (window.location.pathname === '/oauth-success') {
      const name = params.get('name');
      const email = params.get('email');
      if (name && email) {
        const userData = { name, email };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
      window.history.replaceState({}, '', '/');
    }

    if (window.location.pathname === '/oauth-error') {
      const reason = params.get('reason');
      if (reason === 'unauthorized') {
        setOauthError('Only users with @kloctechnologies.com emails are allowed.');
      } else {
        setOauthError('Something went wrong with Google OAuth. Please try again.');
      }
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (!user) {
    return (
      <div className="App login-container">
        <h1>Please sign in with Google to continue</h1>
        {oauthError && <p style={{ color: 'red' }}>{oauthError}</p>}
        <AuthButton />
      </div>
    );
  }

  return (
    <Router>
      <div className="App app-layout">
        <SideNav user={user} onLogout={handleLogout} />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Navigate to="/time-allocation" replace />} />
            <Route path="/time-allocation" element={<TimeAllocationPage user={user} />} />
            {/* <Route path="/filter-table" element={<FilterTablePage />} /> */}
            <Route
              path="/filter-table"
              element={
                <ProtectedRoute user={user} allowedEmails={allowedEmails}>
                  <FilterTablePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<h2>404 - Page Not Found</h2>} />
            <Route path="/oauth-success" element={<Navigate to="/" replace />} />
            <Route path="/oauth-error" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
