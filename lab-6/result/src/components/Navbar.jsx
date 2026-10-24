import { useAuth } from '../context/useAuth';

export default function Navbar({
  authView,
  setAuthView,
  theme,
  toggleTheme,
  activeTab,
  setActiveTab
}) {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="vit-navbar no-print">
      <div className="vit-nav-container">
        {/* Brand */}
        <div className="vit-nav-brand">
          <div className="vit-crest-badge">
            <span className="vit-crest-icon">🏛️</span>
          </div>
          <div className="vit-brand-info">
            <div className="vit-brand-main">
              <span className="vit-bold">VIT</span> Result Portal
            </div>
            <span className="vit-sub-term">Semester IV • Winter/Fall 2025-26</span>
          </div>
        </div>

        {/* Navigation Tabs (if authenticated) */}
        {isAuthenticated && (
          <nav className="vit-nav-links">
            {user.role === 'Faculty' ? (
              <>
                <button
                  type="button"
                  className={`vit-tab-link ${activeTab === 'entry' ? 'active' : ''}`}
                  onClick={() => setActiveTab('entry')}
                >
                  📝 Marks Entry & Calc
                </button>
                <button
                  type="button"
                  className={`vit-tab-link ${activeTab === 'registry' ? 'active' : ''}`}
                  onClick={() => setActiveTab('registry')}
                >
                  📋 Student Registry
                </button>
                <button
                  type="button"
                  className={`vit-tab-link ${activeTab === 'analytics' ? 'active' : ''}`}
                  onClick={() => setActiveTab('analytics')}
                >
                  📊 Class Analytics
                </button>
                <button
                  type="button"
                  className={`vit-tab-link ${activeTab === 'gradeCard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('gradeCard')}
                >
                  📄 Official Marksheet
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className={`vit-tab-link ${activeTab === 'gradeCard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('gradeCard')}
                >
                  🎓 My Semester Grade Card
                </button>
                <button
                  type="button"
                  className={`vit-tab-link ${activeTab === 'curriculum' ? 'active' : ''}`}
                  onClick={() => setActiveTab('curriculum')}
                >
                  📚 Course Syllabus
                </button>
              </>
            )}
          </nav>
        )}

        {/* Right Controls */}
        <div className="vit-nav-right">
          <button
            type="button"
            className="vit-theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {isAuthenticated ? (
            <div className="vit-user-dropdown-mock">
              <div className="vit-user-chip">
                <span className="vit-user-avatar">{user.avatar || '👤'}</span>
                <div className="vit-user-meta">
                  <span className="vit-user-name">{user.name}</span>
                  <span className={`vit-user-role-badge role-${user.role.toLowerCase()}`}>
                    {user.role} {user.regNo ? `(${user.regNo})` : ''}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="vit-logout-btn"
                onClick={logout}
                title="Log out from VIT Portal"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="vit-auth-switch-btns">
              <button
                type="button"
                className={`vit-switch-btn ${authView === 'login' ? 'active' : ''}`}
                onClick={() => setAuthView('login')}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`vit-switch-btn ${authView === 'register' ? 'active' : ''}`}
                onClick={() => setAuthView('register')}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
