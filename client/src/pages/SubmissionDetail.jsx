import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSubmission } from '../services/api';
import RiskBadge from '../components/RiskBadge';

const DeviationBar = ({ label, expected, actual, deviation }) => {
  const color = deviation >= 60 ? 'var(--high-risk)' : deviation >= 35 ? 'var(--suspicious)' : 'var(--normal)';
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
        <span style={{ color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', color }}>{deviation.toFixed(1)}% deviation</span>
      </div>
      <div style={{ display: 'flex', gap: 12, fontSize: 12, marginBottom: 6 }}>
        <span style={{ color: 'var(--text-muted)' }}>Expected: <span style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{expected}</span></span>
        <span style={{ color: 'var(--text-muted)' }}>Actual: <span style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{actual}</span></span>
      </div>
      <div style={{ background: 'var(--surface2)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
        <div style={{ width: `${Math.min(deviation, 100)}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.5s' }} />
      </div>
    </div>
  );
};

const SubmissionDetail = () => {
  const { id } = useParams();
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubmission(id).then(r => { setSub(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: 40, color: 'var(--text-muted)' }}>Loading...</div>;
  if (!sub) return <div style={{ padding: 40, color: 'var(--high-risk)' }}>Submission not found.</div>;

  const details = sub.analysisDetails?.details || {};
  const note = sub.analysisDetails?.note;

  return (
    <div style={{ padding: 40 }}>
      <Link to="/submissions" style={{ color: 'var(--text-muted)', fontSize: 13, display: 'inline-block', marginBottom: 24 }}>← Back to Submissions</Link>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 22 }}>{sub.title}</h1>
          <RiskBadge level={sub.riskLevel} />
        </div>
        <div style={{ marginTop: 8, color: 'var(--text-muted)', fontSize: 13 }}>
          By <Link to={`/students/${sub.student?._id}`} style={{ color: 'var(--accent)' }}>{sub.student?.name}</Link>
          {' · '}{sub.wordCount} words{' · '}{new Date(sub.submittedAt).toLocaleString()}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
        {/* Deviation Score */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 14, marginBottom: 20 }}>Deviation Score</h3>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              fontSize: 64, fontWeight: 700, fontFamily: 'var(--font-mono)',
              color: sub.deviationScore >= 60 ? 'var(--high-risk)' : sub.deviationScore >= 35 ? 'var(--suspicious)' : 'var(--normal)'
            }}>
              {sub.deviationScore.toFixed(1)}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>out of 100</div>
            {note && <div style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>{note}</div>}
          </div>
        </div>

        {/* Submission Features */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 14, marginBottom: 16 }}>Extracted Features</h3>
          {sub.features && (
            <div style={{ display: 'grid', gap: 8 }}>
              {[
                ['Avg Word Length', sub.features.avgWordLength + ' chars'],
                ['Avg Sentence Length', sub.features.avgSentenceLength + ' words'],
                ['Vocabulary Richness', (sub.features.vocabularyRichness * 100).toFixed(1) + '%'],
                ['Punctuation / 100w', sub.features.punctuationFrequency],
                ['Sentence Complexity', sub.features.sentenceComplexity],
                ['Passive Voice Ratio', (sub.features.passiveVoiceRatio * 100).toFixed(1) + '%'],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent2)' }}>{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Feature-by-Feature Breakdown */}
      {Object.keys(details).length > 0 && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 28 }}>
          <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 14, marginBottom: 20 }}>Feature Deviation Breakdown</h3>
          {Object.values(details).map(d => (
            <DeviationBar key={d.label} label={d.label} expected={d.expected} actual={d.actual} deviation={d.deviation} />
          ))}
        </div>
      )}

      {/* Content Preview */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 14, marginBottom: 16 }}>Submission Content</h3>
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: 'var(--text-muted)', fontSize: 14, maxHeight: 400, overflowY: 'auto' }}>
          {sub.content}
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetail;
