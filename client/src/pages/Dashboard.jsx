import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../services/api';
import RiskBadge from '../components/RiskBadge';

const StatCard = ({ label, value, color }) => (
  <div style={{
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 12, padding: 24, flex: 1
  }}>
    <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
    <div style={{ fontSize: 36, fontWeight: 700, color: color || 'var(--text)', marginTop: 8, fontFamily: 'var(--font-mono)' }}>{value}</div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard().then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, color: 'var(--text-muted)' }}>Loading dashboard...</div>;
  if (!data) return <div style={{ padding: 40, color: 'var(--high-risk)' }}>Failed to load. Is the server running?</div>;

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 24, marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Overview of all submissions and risk levels</p>

      {/* Stat Cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Students" value={data.totalStudents} />
        <StatCard label="Total Submissions" value={data.totalSubmissions} />
        <StatCard label="Normal" value={data.riskSummary.normal} color="var(--normal)" />
        <StatCard label="Suspicious" value={data.riskSummary.suspicious} color="var(--suspicious)" />
        <StatCard label="High Risk" value={data.riskSummary.high_risk} color="var(--high-risk)" />
      </div>

      {/* Recent Submissions */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>
          Recent Submissions
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--surface2)' }}>
              {['Student', 'Course', 'Title', 'Deviation Score', 'Risk Level', 'Date'].map(h => (
                <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.recentSubmissions.map((sub, i) => (
              <tr key={sub._id} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                <td style={{ padding: '14px 20px' }}>
                  <Link to={`/students/${sub.student?._id}`} style={{ color: 'var(--accent)', fontWeight: 500 }}>
                    {sub.student?.name}
                  </Link>
                </td>
                <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: 13 }}>{sub.student?.course}</td>
                <td style={{ padding: '14px 20px' }}>
                  <Link to={`/submissions/${sub._id}`} style={{ color: 'var(--text)' }}>{sub.title}</Link>
                </td>
                <td style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: sub.deviationScore >= 60 ? 'var(--high-risk)' : sub.deviationScore >= 35 ? 'var(--suspicious)' : 'var(--normal)' }}>
                    {sub.deviationScore.toFixed(1)}%
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}><RiskBadge level={sub.riskLevel} /></td>
                <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: 13 }}>
                  {new Date(sub.submittedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.recentSubmissions.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            No submissions yet. <Link to="/submit" style={{ color: 'var(--accent)' }}>Add one →</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
