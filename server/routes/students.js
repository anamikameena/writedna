const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Submission = require('../models/Submission');
const { protect } = require('../middleware/auth');

router.use(protect); // all student routes require login

// GET all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single student with their submissions
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const submissions = await Submission.find({ student: req.params.id }).sort({ submittedAt: -1 });
    res.json({ student, submissions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new student
router.post('/', async (req, res) => {
  try {
    const { name, email, studentId, course } = req.body;
    if (!name || !email || !studentId || !course)
      return res.status(400).json({ error: 'All fields are required' });

    const student = new Student({ name, email, studentId, course });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Student ID or email already exists' });
    res.status(500).json({ error: err.message });
  }
});

// DELETE student
router.delete('/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    await Submission.deleteMany({ student: req.params.id });
    res.json({ message: 'Student and all submissions deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
