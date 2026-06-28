const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const { protect } = require('../middleware/auth');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields are required' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const exists = await Teacher.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });

    const teacher = await Teacher.create({ name, email, password });
    const token = signToken(teacher._id);

    res.status(201).json({
      token,
      teacher: { id: teacher._id, name: teacher.name, email: teacher.email, role: teacher.role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    const teacher = await Teacher.findOne({ email });
    if (!teacher || !(await teacher.comparePassword(password)))
      return res.status(401).json({ error: 'Invalid email or password' });

    const token = signToken(teacher._id);
    res.json({
      token,
      teacher: { id: teacher._id, name: teacher.name, email: teacher.email, role: teacher.role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me  — protected
router.get('/me', protect, (req, res) => {
  res.json({ teacher: req.teacher });
});

module.exports = router;
