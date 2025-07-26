import Symptom from '../models/Symptom.js';
import { analyzeTextWithLLM } from '../services/aiService.js';

export const createSymptom = async (req, res) => {
  try {
    const { symptoms } = req.body;
    const userId = req.userId;
    let aiRes = {};
    let analysis = '';
    let confidence = null;
    let scan_details = '';
    let insights = '';
    try {
      aiRes = await analyzeTextWithLLM(symptoms, 100, 'symptom');
      analysis = aiRes.analysis || aiRes.message || '';
      confidence = aiRes.confidence !== undefined ? aiRes.confidence : null;
      scan_details = aiRes.scan_details || '';
      insights = aiRes.insights || '';
    } catch (aiErr) {
      analysis = 'AI analysis failed.';
    }
    const entry = new Symptom({
      user: userId,
      symptoms,
      analysis
    });
    await entry.save();
    res.status(201).json({
      ...entry.toObject(),
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

export const getSymptoms = async (req, res) => {
  try {
    const userId = req.userId;
    const entries = await Symptom.find({ user: userId }).sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

export const deleteSymptom = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const deleted = await Symptom.findOneAndDelete({ _id: id, user: userId });
    if (!deleted) return res.status(404).json({ message: 'Symptom entry not found.' });
    res.json({ message: 'Symptom entry deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};