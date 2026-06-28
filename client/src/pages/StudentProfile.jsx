import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { getStudent } from '../services/api';
import RiskBadge from '../components/RiskBadge';

const StudentProfile = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudent(id).then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: 40, color: 'var(--text-muted)' }}>Loading profile...</div>;
  if (!data) return <div style={{ padding: 40, color: 'var(--high-risk)' }}>Student not found.</div>;

  const { student, submissions } = data;
  const fp = student.fingerprint;

  const radarData = fp?.submissionCount >= 1 ? [
    { feature: 'Word Length', value: Math.min(fp.avgWordLength * 15, 100) },
    { feature: 'Sent. Length', value: Math.min(fp.avgSentenceLength * 3, 100) },
    { feature: 'Vocabulary', value: Math.min(fp.vocabularyRichness * 100, 100) },
    { feature: 'Punctuation', value: Math.min(fp.punctuationFrequency * 5, 100) },
    { feature: 'Complexity', value: Math.min(fp.sentenceComplexity * 30, 100) },
    { feature: 'Passive Voice', value: Math.min(fp.passiveVoiceRatio * 100, 100) },
  ] : [];

  return (
    <div style={{ padding: 40 }}>
      <Link to="/students" style={{ color: 'var(--text-muted)', fontSize: 13, display: 'inline-block', marginBottom: 24 }}>← Back to Students</Link>

      {/* Header */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, fontWeight: 700, color: '#fff', flexShrink: 0
        }}>
          {student.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 22 }}>{student.name}</h1>
          <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>{student.email} · {student.studentId}</div>
          <div style={{ color: 'var(--accent2)', fontSize: 13, marginTop: 2 }}>{student.course}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Fingerprint Stats */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-mono)', marginBottom: 16, fontSize: 14 }}>Writing Fingerprint</h3>
          {fp?.submissionCount >= 1 ? (
            <div style={{ display: 'grid', gap: 10 }}>
              {[
                ['Avg Word Length', fp.avgWordLength + ' chars'],
                ['Avg Sentence Length', fp.avgSentenceLength + ' words'],
                ['Vocabulary Richness', (fp.vocabularyRichness * 100).toFixed(1) + '%'],
                ['Punctuation / 100 words', fp.punctuationFrequency],
                ['Sentence Complexity', fp.sentenceComplexity + ' clauses/sent'],
                ['Passive Voice Ratio', (fp.passiveVoiceRatio * 100).toFixed(1) + '%'],
                ['Based on submissions', fp.submissionCount],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent2)' }}>{val}</span>
                </div>
              ))}
              {fp.topWords?.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 6 }}>Top Words</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {fp.topWords.map(w => (
                      <span key={w} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 8px', fontSize: 12, fontFamily: 'var(--font-mono)' }}>{w}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No submissions yet. Fingerprint will be built after the first submission.</div>
          )}
        </div>

        {/* Radar Chart */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-mono)', marginBottom: 16, fontSize: 14 }}>Fingerprint Radar</h3>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#2a2a3d" />
                <PolarAngleAxis dataKey="feature" tick={{ fill: '#888899', fontSize: 11 }} />
                <Radar name="Fingerprint" dataKey="value" stroke="#7c6fcd" fill="#7c6fcd" fillOpacity={0.2} />
                <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8 }} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: 13, paddingTop: 20 }}>Chart available after first submission.</div>
          )}
        </div>
      </div>

      {/* Submission History */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>
          Submission History ({submissions.length})
        </div>
        {submissions.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No submissions yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface2)' }}>
                {['Title', 'Words', 'Deviation Score', 'Risk Level', 'Date'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, i) => (
                <tr key={sub._id} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <Link to={`/submissions/${sub._id}`} style={{ color: 'var(--accent)' }}>{sub.title}</Link>
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
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
