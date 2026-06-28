import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginTeacher } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Both fields are required'); return; }
    setLoading(true);
    try {
      const res = await loginTeacher(form);
      login(res.data.token, res.data.teacher);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'fixed', top: -120, right: -120, width: 400, height: 400,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,111,205,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: -100, left: -100, width: 350, height: 350,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(78,205,196,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 420, padding: '0 24px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700, color: 'var(--accent)' }}>
            Write<span style={{ color: 'var(--accent2)' }}>DNA</span>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>Academic Integrity System</div>
        </div>

        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 16, padding: 36,
        }}>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 18, marginBottom: 6 }}>Teacher Login</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 28 }}>Sign in to access your dashboard</p>

          <div style={{ display: 'grid', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>EMAIL</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="teacher@school.edu"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>PASSWORD</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          </div>

          {error && (
            <div style={{
              marginTop: 16, padding: '10px 14px', borderRadius: 8, fontSize: 13,
              background: 'rgba(239,87,119,0.1)', border: '1px solid rgba(239,87,119,0.3)', color: 'var(--high-risk)'
            }}>{error}</div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', marginTop: 24, padding: '13px', borderRadius: 8,
              background: 'var(--accent)', color: '#fff', border: 'none',
              fontWeight: 700, fontSize: 15, opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
            No account?{' '}
            <Link to="/register" style={{ color: 'var(--accent2)', fontWeight: 500 }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
