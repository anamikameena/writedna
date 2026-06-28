import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudents, createSubmission } from '../services/api';
import RiskBadge from '../components/RiskBadge';

const Submit = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', title: '', content: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => { getStudents().then(r => setStudents(r.data)); }, []);

  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = async () => {
    setError('');
    if (!form.studentId || !form.title || !form.content) {
      setError('All fields are required'); return;
    }
    if (wordCount < 50) {
      setError('Please enter at least 50 words for analysis'); return;
    }
    setSubmitting(true);
    try {
      const res = await createSubmission(form);
      setResult(res.data);
    } catch (e) {
      setError(e.response?.data?.error || 'Submission failed');
    }
    setSubmitting(false);
  };

  if (result) {
    const { analysis, submission } = result;
    const color = analysis.deviationScore >= 60 ? 'var(--high-risk)' : analysis.deviationScore >= 35 ? 'var(--suspicious)' : 'var(--normal)';
    return (
      <div style={{ padding: 40, maxWidth: 640 }}>
        <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 24, marginBottom: 8 }}>Analysis Complete</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Submission analyzed and fingerprint updated.</p>

        <div style={{ background: 'var(--surface)', border: `1px solid ${color}`, borderRadius: 12, padding: 32, textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 72, fontWeight: 700, fontFamily: 'var(--font-mono)', color }}>{analysis.deviationScore.toFixed(1)}</div>
          <div style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Deviation Score</div>
          <RiskBadge level={analysis.riskLevel} />
          {analysis.note && <div style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>{analysis.note}</div>}
        </div>

        {analysis.details && Object.keys(analysis.details).length > 0 && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 13, marginBottom: 16 }}>Feature Breakdown</h3>
            {Object.values(analysis.details).map(d => {
              const c = d.deviation >= 60 ? 'var(--high-risk)' : d.deviation >= 35 ? 'var(--suspicious)' : 'var(--normal)';
              return (
                <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 10 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{d.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: c }}>{d.deviation.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate(`/submissions/${submission._id}`)} style={{
            flex: 1, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 20px', fontWeight: 600
          }}>View Full Report</button>
          <button onClick={() => { setResult(null); setForm({ studentId: '', title: '', content: '' }); }} style={{
            flex: 1, background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 20px', fontWeight: 600
          }}>New Submission</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 720 }}>
      <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 24, marginBottom: 8 }}>New Submission</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Paste or type a student's submission to analyze it against their writing fingerprint.</p>

      <div style={{ display: 'grid', gap: 20 }}>
        <div>
          <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>STUDENT</label>
          <select value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })}>
            <option value="">Select a student...</option>
            {students.map(s => (
              <option key={s._id} value={s._id}>{s.name} — {s.studentId} ({s.course})</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>ASSIGNMENT TITLE</label>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Essay on Climate Change" />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SUBMISSION TEXT</label>
            <span style={{ fontSize: 12, color: wordCount >= 50 ? 'var(--normal)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {wordCount} words {wordCount < 50 ? `(need ${50 - wordCount} more)` : '✓'}
            </span>
          </div>
          <textarea
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            placeholder="Paste the student's submission here..."
            rows={16}
            style={{ resize: 'vertical', lineHeight: 1.7 }}
          />
        </div>

        {error && <div style={{ color: 'var(--high-risk)', fontSize: 13, padding: '10px 14px', background: 'rgba(239,87,119,0.1)', borderRadius: 8, border: '1px solid rgba(239,87,119,0.3)' }}>{error}</div>}

        <button onClick={handleSubmit} disabled={submitting} style={{
          background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8,
          padding: '14px 28px', fontWeight: 700, fontSize: 15,
          opacity: submitting ? 0.7 : 1
        }}>
          {submitting ? 'Analyzing...' : 'Analyze Submission →'}
        </button>
      </div>
    </div>
  );
};

export default Submit;
