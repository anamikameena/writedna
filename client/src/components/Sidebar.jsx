import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { teacher, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: '/', label: 'Dashboard', icon: '⬡' },
    { to: '/students', label: 'Students', icon: '◈' },
    { to: '/submissions', label: 'Submissions', icon: '◎' },
    { to: '/submit', label: 'New Submission', icon: '⊕' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside style={{
      width: 220, minHeight: '100vh', background: 'var(--surface)',
      borderRight: '1px solid var(--border)', padding: '32px 0',
      display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0
    }}>
      <div style={{ padding: '0 24px 32px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--accent)', fontWeight: 700 }}>
          Write<span style={{ color: 'var(--accent2)' }}>DNA</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Academic Integrity System</div>
      </div>

      <nav style={{ flex: 1 }}>
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to} to={to} end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 24px', fontSize: 14, fontWeight: 500,
              color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              background: isActive ? 'rgba(124,111,205,0.1)' : 'transparent',
              borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              transition: 'all 0.2s',
            })}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16 }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Teacher info + logout */}
      {teacher && (
        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {teacher.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{teacher.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Teacher</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '8px', borderRadius: 6, fontSize: 12, fontWeight: 500,
            background: 'transparent', border: '1px solid var(--border)',
            color: 'var(--text-muted)', cursor: 'pointer',
          }}>
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
