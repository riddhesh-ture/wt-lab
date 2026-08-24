import { useState } from 'react';
import { useAuth } from '../context/useAuth';

export default function RegisterForm({ onSwitchToLogin }) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student',
    regNo: '',
    program: 'B.Tech Computer Science and Engineering'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill out all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    const res = await register(formData);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Registration failed.');
    } else {
      setSuccess('VIT Portal account registered successfully! Redirecting to sign in...');
      setTimeout(() => {
        onSwitchToLogin();
      }, 1200);
    }
  };

  return (
    <div className="vit-auth-box">
      <div className="auth-crest-wrap">
        <span className="auth-crest-icon">📝</span>
      </div>

      <div className="auth-box-header">
        <div className="auth-domain-tag">ACCOUNT REGISTRATION</div>
        <h2 className="auth-box-title">New Portal Account</h2>
        <p className="auth-box-desc">Register as a VIT Student or Faculty member</p>
      </div>

      {error && (
        <div className="vit-alert vit-alert-error" role="alert">
          <span className="alert-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="vit-alert vit-alert-success" role="alert">
          <span className="alert-icon">✅</span>
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="vit-form">
        <div className="form-item">
          <label htmlFor="reg-role">Portal Role</label>
          <div className="role-selector-pills">
            <button
              type="button"
              className={`role-pill-btn ${formData.role === 'Student' ? 'selected' : ''}`}
              onClick={() => handleChange('role', 'Student')}
            >
              🎓 Student
            </button>
            <button
              type="button"
              className={`role-pill-btn ${formData.role === 'Faculty' ? 'selected' : ''}`}
              onClick={() => handleChange('role', 'Faculty')}
            >
              👨‍🏫 Faculty
            </button>
          </div>
        </div>

        <div className="form-item">
          <label htmlFor="reg-name">Full Name *</label>
          <input
            id="reg-name"
            type="text"
            placeholder="e.g. Aarav Sharma"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>

        <div className="form-item">
          <label htmlFor="reg-email">VIT Email Address *</label>
          <input
            id="reg-email"
            type="email"
            placeholder="e.g. name.surname@vit.edu"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
        </div>

        {formData.role === 'Student' && (
          <div className="form-item">
            <label htmlFor="reg-regno">Registration No. / PRN</label>
            <input
              id="reg-regno"
              type="text"
              placeholder="e.g. 21BCE1042"
              value={formData.regNo}
              onChange={(e) => handleChange('regNo', e.target.value.toUpperCase())}
            />
          </div>
        )}

        <div className="form-item">
          <label htmlFor="reg-password">Password (Min 6 characters) *</label>
          <input
            id="reg-password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn-vit-primary w-100"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Complete Registration →'}
        </button>
      </form>

      <div className="auth-box-foot">
        <span>Already have an account?</span>
        <button
          type="button"
          className="btn-text-link"
          onClick={onSwitchToLogin}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
