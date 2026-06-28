import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSubmissions } from '../services/api';
import RiskBadge from '../components/RiskBadge';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getSubmissions().then(r => { setSubmissions(r.data); setLoading(false); });
  }, []);

  const filtered = filter === 'all' ? submissions : submissions.filter(s => s.riskLevel === filter);

  if (loading) return <div style={{ padding: 40, color: 'var(--text-muted)' }}>Loading...</div>;

  return (
    <div style={{ padding: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 24, marginBottom: 4 }}>Submissions</h1>
          <p style={{ color: 'var(--text-muted)' }}>{submissions.length} total submissions</p>
        </div>
        <Link to="/submit" style={{
          background: 'var(--accent)', color: '#fff', borderRadius: 8,
          padding: '10px 20px', fontWeight: 600, fontSize: 14
        }}>+ New Submission</Link>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[['all', 'All'], ['normal', 'Normal'], ['suspicious', 'Suspicious'], ['high_risk', 'High Risk']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} style={{
            padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500,
            border: '1px solid var(--border)',
            background: filter === val ? 'var(--accent)' : 'transparent',
            color: filter === val ? '#fff' : 'var(--text-muted)',
          }}>{label}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--surface2)' }}>
              {['Student', 'Course', 'Title', 'Words', 'Deviation', 'Risk', 'Submitted'].map(h => (
                <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((sub, i) => (
              <tr key={sub._id} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                <td style={{ padding: '14px 20px' }}>
                  <Link to={`/students/${sub.student?._id}`} style={{ color: 'var(--accent)', fontWeight: 500 }}>{sub.student?.name}</Link>
                </td>
                <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: 13 }}>{sub.student?.course}</td>
                <td style={{ padding: '14px 20px' }}>
                  <Link to={`/submissions/${sub._id}`} style={{ color: 'var(--text)' }}>{sub.title}</Link>
                </td>
                <td style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{sub.wordCount}</td>
                <td style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: sub.deviationScore >= 60 ? 'var(--high-risk)' : sub.deviationScore >= 35 ? 'var(--suspicious)' : 'var(--normal)' }}>
                    {sub.deviationScore.toFixed(1)}%
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}><RiskBadge level={sub.riskLevel} /></td>
                <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: 13 }}>{new Date(sub.submittedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No submissions found.</div>
        )}
      </div>
    </div>
  );
};

export default Submissions;
