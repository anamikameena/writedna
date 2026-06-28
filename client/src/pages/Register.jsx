import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerTeacher } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!form.name || !form.email || !form.password) { setError('All fields are required'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }

    setLoading(true);
    try {
      const res = await registerTeacher({ name: form.name, email: form.email, password: form.password });
      login(res.data.token, res.data.teacher);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)',
    }}>
      <div style={{
        position: 'fixed', top: -120, left: -120, width: 400, height: 400,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(78,205,196,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 420, padding: '0 24px' }}>
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
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 18, marginBottom: 6 }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 28 }}>Register as a teacher to get started</p>

          <div style={{ display: 'grid', gap: 16 }}>
            {[
              ['name', 'FULL NAME', 'text', 'Dr. Jane Smith'],
              ['email', 'EMAIL', 'email', 'teacher@school.edu'],
              ['password', 'PASSWORD', 'password', 'Min. 6 characters'],
              ['confirm', 'CONFIRM PASSWORD', 'password', 'Repeat password'],
            ].map(([key, label, type, placeholder]) => (
              <div key={key}>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
              </div>
            ))}
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
              background: 'var(--accent2)', color: '#0a0a0f', border: 'none',
              fontWeight: 700, fontSize: 15, opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
