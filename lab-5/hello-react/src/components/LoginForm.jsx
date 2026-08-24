import { useState } from 'react';
import { useAuth } from '../context/useAuth';

export default function LoginForm({ onSwitchToRegister }) {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError('Please enter your VIT email or Reg No and password.');
      return;
    }

    setLoading(true);
    const result = await login(identifier, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleQuickDemo = async (demoIdentifier, demoPassword) => {
    setIdentifier(demoIdentifier);
    setPassword(demoPassword);
    setError('');
    setLoading(true);
    const result = await login(demoIdentifier, demoPassword);
    setLoading(false);
    if (!result.success) {
      setError(result.error || 'Demo login failed.');
    }
  };

  return (
    <div className="vit-auth-box">
      <div className="auth-crest-wrap">
        <span className="auth-crest-icon">🏛️</span>
      </div>

      <div className="auth-box-header">
        <div className="auth-domain-tag">VIT EXAM CELL PORTAL</div>
        <h2 className="auth-box-title">Academic Sign In</h2>
        <p className="auth-box-desc">
          Sign in to prepare, calculate, or access Semester IV examination results
        </p>
      </div>

      {error && (
        <div className="vit-alert vit-alert-error" role="alert">
          <span className="alert-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="vit-form">
        <div className="form-item">
          <label htmlFor="auth-id">VIT Email or Registration No. / PRN</label>
          <div className="field-container">
            <span className="field-ico">🎓</span>
            <input
              id="auth-id"
              type="text"
              placeholder="e.g. student@vit.edu or 21BCE1042"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
        </div>

        <div className="form-item">
          <label htmlFor="auth-pass">Password</label>
          <div className="field-container">
            <span className="field-ico">🔒</span>
            <input
              id="auth-pass"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="btn-show-pass"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="btn-vit-primary w-100"
          disabled={loading}
        >
          {loading ? 'Authenticating...' : 'Sign In to Portal →'}
        </button>
      </form>

      {/* One-click Demo Cards for quick testing */}
      <div className="quick-demos-section">
        <span className="demos-title">⚡ Instant Academic Logins:</span>
        <div className="demo-pills-list">
          <button
            type="button"
            className="demo-pill-btn faculty"
            onClick={() => handleQuickDemo('faculty@vit.edu', 'vit123')}
            disabled={loading}
          >
            <span className="pill-avatar">👨‍🏫</span>
            <div className="pill-text">
              <span className="pill-role">Faculty / Exam Cell</span>
              <span className="pill-email">faculty@vit.edu</span>
            </div>
            <span className="pill-badge">Prepare Marks</span>
          </button>

          <button
            type="button"
            className="demo-pill-btn student"
            onClick={() => handleQuickDemo('student@vit.edu', 'vit123')}
            disabled={loading}
          >
            <span className="pill-avatar">🎓</span>
            <div className="pill-text">
              <span className="pill-role">VIT Student (Aarav)</span>
              <span className="pill-email">student@vit.edu • 21BCE1042</span>
            </div>
            <span className="pill-badge">View Grade Card</span>
          </button>
        </div>
      </div>

      <div className="auth-box-foot">
        <span>Need a new account?</span>
        <button
          type="button"
          className="btn-text-link"
          onClick={onSwitchToRegister}
        >
          Register here
        </button>
      </div>
    </div>
  );
}
