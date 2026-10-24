import { useState, useEffect } from 'react';
import AuthProvider from './context/AuthProvider';
import { useAuth } from './context/useAuth';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import './App.css';

function MainLayout() {
  const { user, isAuthenticated, loading } = useAuth();
  const [authView, setAuthView] = useState('login');
  const [selectedTab, setActiveTab] = useState(null);
  const activeTab = selectedTab || (user?.role === 'Student' ? 'gradeCard' : 'entry');
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('vit_theme') || 'light';
    } catch {
      return 'light';
    }
  });

  // Reset tab selection whenever the logged-in user changes (login / logout / switch account)
  useEffect(() => {
    setActiveTab(null);
    if (!user) setAuthView('login');
  }, [user?.id]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('vit_theme', theme);
    } catch (e) {
      console.warn('Could not save theme:', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  if (loading) {
    return (
      <div className="vit-loading-screen">
        <div className="vit-spinner"></div>
        <p className="vit-loading-text">Loading VIT Academic Results Portal...</p>
      </div>
    );
  }

  return (
    <div className="vit-app-wrapper">
      <Navbar
        authView={authView}
        setAuthView={setAuthView}
        theme={theme}
        toggleTheme={toggleTheme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="vit-main-content">
        {isAuthenticated ? (
          <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />
        ) : (
          <div className="vit-portal-hero-layout">
            {/* Left Hero Showcase */}
            <div className="portal-left-showcase">
              <div className="portal-crest-pill">
                <span className="crest-symbol">🏛️</span>
                <span>vishawakarma Institute of Technology • Examination Cell</span>
              </div>

              <h1 className="portal-main-headline">
                One-Semester Result <br />
                <span className="text-highlight">Preparation Portal</span>
              </h1>

              <p className="portal-sub-headline">
                Official academic portal for calculating, publishing, and verifying Semester IV examination results with <strong>MSE (30%)</strong> and <strong>ESE (70%)</strong> weighted evaluation.
              </p>

              <div className="portal-subjects-banner">
                <span className="banner-title">Prescribed 4 Core Subjects (14 Credits):</span>
                <div className="banner-badges-grid">
                  <div className="course-badge">
                    <span className="badge-code">BCSE301L</span>
                    <span className="badge-name">Web Technology (4 Cr)</span>
                  </div>
                  <div className="course-badge">
                    <span className="badge-code">BCSE302L</span>
                    <span className="badge-name">Database Systems (4 Cr)</span>
                  </div>
                  <div className="course-badge">
                    <span className="badge-code">BCSE303L</span>
                    <span className="badge-name">Operating Systems (3 Cr)</span>
                  </div>
                  <div className="course-badge">
                    <span className="badge-code">BCSE304L</span>
                    <span className="badge-name">Computer Networks (3 Cr)</span>
                  </div>
                </div>
              </div>

              <div className="portal-features-cards">
                <div className="portal-feat-card">
                  <span className="feat-ico">⚖️</span>
                  <div>
                    <h4>30% MSE + 70% ESE Weightage</h4>
                    <p>Automated real-time calculation of total marks out of 100 per subject.</p>
                  </div>
                </div>

                <div className="portal-feat-card">
                  <span className="feat-ico">📊</span>
                  <div>
                    <h4>SGPA & VIT Letter Grading</h4>
                    <p>Accurate letter grading (S, A, B, C, D, E, F) and weighted Grade Points.</p>
                  </div>
                </div>

                <div className="portal-feat-card">
                  <span className="feat-ico">🖨️</span>
                  <div>
                    <h4>Printable Official Marksheet</h4>
                    <p>Format compliant with university standards and Controller of Examinations seal.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Authentication Form */}
            <div className="portal-right-auth">
              {authView === 'login' ? (
                <LoginForm onSwitchToRegister={() => setAuthView('register')} />
              ) : (
                <RegisterForm onSwitchToLogin={() => setAuthView('login')} />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
