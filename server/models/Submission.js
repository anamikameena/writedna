const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  wordCount: { type: Number },

  // Extracted features for this submission
  features: {
    avgWordLength: Number,
    avgSentenceLength: Number,
    vocabularyRichness: Number,
    punctuationFrequency: Number,
    avgParagraphLength: Number,
    topWords: [String],
    sentenceComplexity: Number,
    passiveVoiceRatio: Number,
  },

  // Analysis result
  deviationScore: { type: Number, default: 0 },     // 0-100
  riskLevel: {
    type: String,
    enum: ['normal', 'suspicious', 'high_risk'],
    default: 'normal'
  },
  analysisDetails: { type: Object },                 // breakdown per feature

  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Submission', submissionSchema);
