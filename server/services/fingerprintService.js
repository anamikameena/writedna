/**
 * WriteDNA — Writing Fingerprint Analysis Service
 * Extracts linguistic features from text and compares against a student's fingerprint
 */

/**
 * Extract linguistic features from a piece of text
 */
function extractFeatures(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const words = text.toLowerCase().match(/\b[a-z']+\b/g) || [];
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const punctuation = (text.match(/[.,;:!?'"()\-]/g) || []).length;

  // Average word length
  const avgWordLength = words.length
    ? words.reduce((sum, w) => sum + w.length, 0) / words.length
    : 0;

  // Average sentence length (in words)
  const avgSentenceLength = sentences.length
    ? words.length / sentences.length
    : 0;

  // Vocabulary richness (type-token ratio)
  const uniqueWords = new Set(words);
  const vocabularyRichness = words.length ? uniqueWords.size / words.length : 0;

  // Punctuation frequency per 100 words
  const punctuationFrequency = words.length
    ? (punctuation / words.length) * 100
    : 0;

  // Average paragraph length in sentences
  const avgParagraphLength = paragraphs.length
    ? sentences.length / paragraphs.length
    : sentences.length;

  // Top 10 most used content words (excluding stopwords)
  const stopwords = new Set([
    'the','a','an','and','or','but','in','on','at','to','for','of','with',
    'is','was','are','were','be','been','being','have','has','had','do',
    'does','did','will','would','could','should','may','might','i','you',
    'he','she','it','we','they','this','that','these','those','my','your',
    'his','her','its','our','their','not','no','so','as','if','by','from'
  ]);
  const wordFreq = {};
  words.forEach(w => {
    if (!stopwords.has(w) && w.length > 2) wordFreq[w] = (wordFreq[w] || 0) + 1;
  });
  const topWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);

  // Sentence complexity: avg number of commas+semicolons per sentence (proxy for clauses)
  const clauseMarkers = (text.match(/[,;]/g) || []).length;
  const sentenceComplexity = sentences.length ? clauseMarkers / sentences.length : 0;

  // Passive voice ratio (simple heuristic: "was/were/been + past participle")
  const passiveMatches = (text.match(/\b(was|were|been|is|are|be)\s+\w+ed\b/gi) || []).length;
  const passiveVoiceRatio = sentences.length ? passiveMatches / sentences.length : 0;

  return {
    avgWordLength: +avgWordLength.toFixed(3),
    avgSentenceLength: +avgSentenceLength.toFixed(3),
    vocabularyRichness: +vocabularyRichness.toFixed(3),
    punctuationFrequency: +punctuationFrequency.toFixed(3),
    avgParagraphLength: +avgParagraphLength.toFixed(3),
    topWords,
    sentenceComplexity: +sentenceComplexity.toFixed(3),
    passiveVoiceRatio: +passiveVoiceRatio.toFixed(3),
  };
}

/**
 * Update the student's rolling fingerprint with a new submission's features
 */
function updateFingerprint(existingFingerprint, newFeatures) {
  const count = (existingFingerprint.submissionCount || 0) + 1;

  // Weighted rolling average — new submission gets weight 1, existing fingerprint has weight (count-1)
  const roll = (existing, newVal) =>
    +((existing * (count - 1) + newVal) / count).toFixed(3);

  return {
    avgWordLength: roll(existingFingerprint.avgWordLength || 0, newFeatures.avgWordLength),
    avgSentenceLength: roll(existingFingerprint.avgSentenceLength || 0, newFeatures.avgSentenceLength),
    vocabularyRichness: roll(existingFingerprint.vocabularyRichness || 0, newFeatures.vocabularyRichness),
    punctuationFrequency: roll(existingFingerprint.punctuationFrequency || 0, newFeatures.punctuationFrequency),
    avgParagraphLength: roll(existingFingerprint.avgParagraphLength || 0, newFeatures.avgParagraphLength),
    sentenceComplexity: roll(existingFingerprint.sentenceComplexity || 0, newFeatures.sentenceComplexity),
    passiveVoiceRatio: roll(existingFingerprint.passiveVoiceRatio || 0, newFeatures.passiveVoiceRatio),
    topWords: newFeatures.topWords,  // update with latest top words
    submissionCount: count,
  };
}

/**
 * Compare new submission features against student's fingerprint
 * Returns a deviationScore (0–100) and per-feature breakdown
 */
function compareWithFingerprint(fingerprint, features) {
  // Need at least 2 submissions before meaningful comparison
  if (!fingerprint || fingerprint.submissionCount < 2) {
    return { deviationScore: 0, riskLevel: 'normal', details: {}, note: 'First submission — fingerprint building' };
  }

  const numericFeatures = [
    { key: 'avgWordLength', weight: 1.5, label: 'Avg Word Length' },
    { key: 'avgSentenceLength', weight: 2.0, label: 'Avg Sentence Length' },
    { key: 'vocabularyRichness', weight: 2.5, label: 'Vocabulary Richness' },
    { key: 'punctuationFrequency', weight: 1.0, label: 'Punctuation Frequency' },
    { key: 'avgParagraphLength', weight: 1.0, label: 'Avg Paragraph Length' },
    { key: 'sentenceComplexity', weight: 1.5, label: 'Sentence Complexity' },
    { key: 'passiveVoiceRatio', weight: 1.0, label: 'Passive Voice Ratio' },
  ];

  const details = {};
  let totalWeight = 0;
  let weightedDeviation = 0;

  numericFeatures.forEach(({ key, weight, label }) => {
    const expected = fingerprint[key] || 0;
    const actual = features[key] || 0;

    // Normalize deviation: percentage difference capped at 100
    const deviation = expected !== 0
      ? Math.min(Math.abs(actual - expected) / expected, 1) * 100
      : actual > 0 ? 50 : 0;

    details[key] = { label, expected, actual, deviation: +deviation.toFixed(1) };
    weightedDeviation += deviation * weight;
    totalWeight += weight;
  });

  const deviationScore = Math.min(+(weightedDeviation / totalWeight).toFixed(1), 100);

  const riskLevel =
    deviationScore >= 60 ? 'high_risk' :
    deviationScore >= 35 ? 'suspicious' :
    'normal';

  return { deviationScore, riskLevel, details };
}

module.exports = { extractFeatures, updateFingerprint, compareWithFingerprint };
