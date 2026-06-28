const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Submission = require('../models/Submission');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET dashboard summary stats
router.get('/', async (req, res) => {
  try {
    const [totalStudents, totalSubmissions, riskCounts, recentSubmissions] = await Promise.all([
      Student.countDocuments(),
      Submission.countDocuments(),
      Submission.aggregate([
        { $group: { _id: '$riskLevel', count: { $sum: 1 } } }
      ]),
      Submission.find()
        .populate('student', 'name studentId course')
        .sort({ submittedAt: -1 })
        .limit(10),
    ]);

    const riskSummary = { normal: 0, suspicious: 0, high_risk: 0 };
    riskCounts.forEach(r => { riskSummary[r._id] = r.count; });

    res.json({
      totalStudents,
      totalSubmissions,
      riskSummary,
      recentSubmissions,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
