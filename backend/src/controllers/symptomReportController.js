import SymptomReport from '../models/SymptomReport.js';
import { analyzeTextWithLLM } from '../services/aiService.js';

export const createSymptomReport = async (req, res) => {
  try {
    const { symptoms } = req.body;
    const userId = req.userId;

    // Compose prompt for AI
    const prompt = `Symptom Description: ${symptoms}`;
    let aiRes = {};
    let short_summary = '';
    let analysis = '';
    let confidence = null;
    let scan_details = '';
    let insights = '';

    try {
      aiRes = await analyzeTextWithLLM(prompt, 150, 'symptom');
      analysis = aiRes.analysis || aiRes.message || '';
      short_summary = aiRes.short_summary || '';
      confidence = aiRes.confidence !== undefined ? aiRes.confidence : null;
      scan_details = aiRes.scan_details || '';
      insights = aiRes.insights || '';

      // Parse AI analysis if it’s a stringified JSON object
      if (typeof analysis === 'string') {
        try {
          const parsed = JSON.parse(analysis);
          if (parsed && typeof parsed === 'object') {
            short_summary = parsed.short_summary || short_summary;
            analysis = parsed.analysis || analysis;
            if (parsed.confidence !== undefined && parsed.confidence !== null) confidence = parsed.confidence;
            scan_details = parsed.scan_details || scan_details;
            insights = parsed.insights || insights;
          }
        } catch (err) {
          // Not a JSON string – ignore and proceed
        }
      }
    } catch (aiErr) {
      analysis = 'AI analysis failed.';
    }

    const entry = new SymptomReport({
      user: userId,
      symptoms,
      short_summary,
      analysis,
      confidence,
      scan_details,
      insights
    });

    await entry.save();

    res.status(201).json({
      ...entry.toObject(),
      short_summary,
      analysis,
      confidence,
      scan_details,
      insights,
      ai: {
        finish_reason: aiRes.finish_reason,
        content_filter_results: aiRes.content_filter_results,
        usage: aiRes.usage,
        model: aiRes.model,
        raw: aiRes.raw
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

export const getSymptomReports = async (req, res) => {
  try {
    const userId = req.userId;
    const entries = await SymptomReport.find({ user: userId }).sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

export const updateSymptomReport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const update = req.body;
    const updated = await SymptomReport.findOneAndUpdate({ _id: id, user: userId }, update, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found.' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

export const deleteSymptomReport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const deleted = await SymptomReport.findOneAndDelete({ _id: id, user: userId });
    if (!deleted) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};
