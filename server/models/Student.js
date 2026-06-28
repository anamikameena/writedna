const mongoose = require('mongoose');

const writingFingerprintSchema = new mongoose.Schema({
  avgWordLength: { type: Number, default: 0 },
  avgSentenceLength: { type: Number, default: 0 },
  vocabularyRichness: { type: Number, default: 0 }, // unique words / total words
  punctuationFrequency: { type: Number, default: 0 },
  avgParagraphLength: { type: Number, default: 0 },
  topWords: [String],                                // most frequently used words
  sentenceComplexity: { type: Number, default: 0 }, // avg clauses per sentence
  passiveVoiceRatio: { type: Number, default: 0 },
  submissionCount: { type: Number, default: 0 },    // how many submissions built this fingerprint
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  studentId: { type: String, required: true, unique: true },
  course: { type: String, required: true },
  fingerprint: { type: writingFingerprintSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Student', studentSchema);
