import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStudents, createStudent, deleteStudent } from '../services/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', studentId: '', course: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchStudents = () => {
    getStudents().then(r => { setStudents(r.data); setLoading(false); });
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSubmit = async () => {
    setError('');
    if (!form.name || !form.email || !form.studentId || !form.course) {
      setError('All fields are required'); return;
    }
    setSubmitting(true);
    try {
      await createStudent(form);
      setForm({ name: '', email: '', studentId: '', course: '' });
      setShowForm(false);
      fetchStudents();
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to create student');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student and all their submissions?')) return;
    await deleteStudent(id);
    fetchStudents();
  };

  if (loading) return <div style={{ padding: 40, color: 'var(--text-muted)' }}>Loading...</div>;

  return (
    <div style={{ padding: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 24, marginBottom: 4 }}>Students</h1>
          <p style={{ color: 'var(--text-muted)' }}>{students.length} registered students</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          background: 'var(--accent)', color: '#fff', border: 'none',
          borderRadius: 8, padding: '10px 20px', fontWeight: 600, fontSize: 14
        }}>
          {showForm ? 'Cancel' : '+ Add Student'}
        </button>
      </div>

      {/* Add Student Form */}
      {showForm && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 28 }}>
          <h3 style={{ marginBottom: 20, fontFamily: 'var(--font-mono)' }}>New Student</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[['name', 'Full Name'], ['email', 'Email'], ['studentId', 'Student ID'], ['course', 'Course']].map(([key, label]) => (
              <div key={key}>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>{label}</label>
                <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={label} />
              </div>
            ))}
          </div>
          {error && <div style={{ color: 'var(--high-risk)', marginTop: 12, fontSize: 13 }}>{error}</div>}
          <button onClick={handleSubmit} disabled={submitting} style={{
            marginTop: 20, background: 'var(--accent2)', color: '#0a0a0f',
            border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700
          }}>
            {submitting ? 'Creating...' : 'Create Student'}
          </button>
        </div>
      )}

      {/* Students Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {students.map(s => (
          <div key={s._id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{s.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--font-mono)', marginTop: 2 }}>{s.studentId}</div>
              </div>
              <button onClick={() => handleDelete(s._id)} style={{
                background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)',
                borderRadius: 6, padding: '4px 8px', fontSize: 12
              }}>✕</button>
            </div>
            <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-muted)' }}>{s.email}</div>
            <div style={{ marginTop: 4, fontSize: 13, color: 'var(--accent2)' }}>{s.course}</div>
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
              Submissions analyzed: <span style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{s.fingerprint?.submissionCount || 0}</span>
            </div>
            <Link to={`/students/${s._id}`} style={{
              display: 'inline-block', marginTop: 16, fontSize: 13, color: 'var(--accent)', fontWeight: 500
            }}>View Profile →</Link>
          </div>
        ))}
      </div>

      {students.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          No students yet. Add one to get started.
        </div>
      )}
    </div>
  );
};

export default Students;
