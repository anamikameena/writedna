const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Submission = require('../models/Submission');
const { extractFeatures, updateFingerprint, compareWithFingerprint } = require('../services/fingerprintService');
const { protect } = require('../middleware/auth');

router.use(protect); // all submission routes require login

// GET all submissions (with student info)
router.get('/', async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate('student', 'name studentId course')
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single submission
router.get('/:id', async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id).populate('student');
    if (!submission) return res.status(404).json({ error: 'Submission not found' });
    res.json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new submission — core analysis flow
router.post('/', async (req, res) => {
  try {
    const { studentId, title, content } = req.body;

    if (!studentId || !title || !content)
      return res.status(400).json({ error: 'studentId, title, and content are required' });

    if (content.trim().split(/\s+/).length < 50)
      return res.status(400).json({ error: 'Submission must be at least 50 words for analysis' });

    // Find the student
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    // 1. Extract features from new submission
    const features = extractFeatures(content);
    const wordCount = content.trim().split(/\s+/).length;

    // 2. Compare with existing fingerprint
    const { deviationScore, riskLevel, details, note } = compareWithFingerprint(student.fingerprint, features);

    // 3. Create submission record
    const submission = new Submission({
      student: student._id,
      title,
      content,
      wordCount,
      features,
      deviationScore,
      riskLevel,
      analysisDetails: { details, note },
    });
    await submission.save();

    // 4. Update student's rolling fingerprint
    const updatedFingerprint = updateFingerprint(student.fingerprint, features);
    student.fingerprint = updatedFingerprint;
    await student.save();

    res.status(201).json({
      submission,
      analysis: { deviationScore, riskLevel, details, note },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE submission
router.delete('/:id', async (req, res) => {
  try {
    await Submission.findByIdAndDelete(req.params.id);
    res.json({ message: 'Submission deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
