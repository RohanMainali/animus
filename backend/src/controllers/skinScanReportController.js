import SkinScanReport from '../models/SkinScanReport.js';
import { analyzeImageWithLLM } from '../services/aiService.js';

export const createSkinScanReport = async (req, res) => {
  try {
    const { imageUrl, userContext } = req.body;
    const userId = req.userId;
    let aiRes = {};
    let short_summary = '';
    let analysis = '';
    let confidence = null;
    let scan_details = '';
    let insights = '';
    try {
      aiRes = await analyzeImageWithLLM(imageUrl, 'skin', 400, userContext || '');
      short_summary = aiRes.short_summary || '';
      analysis = aiRes.analysis || aiRes.message || '';
      confidence = aiRes.confidence !== undefined ? aiRes.confidence : null;
      scan_details = aiRes.scan_details || '';
      insights = aiRes.insights || '';
      // If analysis is a stringified JSON, parse and extract all fields
      if (typeof analysis === 'string' && analysis.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(analysis);
          if (parsed && typeof parsed === 'object') {
            if (parsed.short_summary) short_summary = parsed.short_summary;
            if (parsed.analysis) analysis = parsed.analysis;
            if (parsed.confidence !== undefined && parsed.confidence !== null) confidence = parsed.confidence;
            if (parsed.scan_details) scan_details = parsed.scan_details;
            if (parsed.insights) insights = parsed.insights;
          }
        } catch (e) {}
      }
    } catch (aiErr) {
      analysis = 'AI analysis failed.';
    }
    const entry = new SkinScanReport({
      user: userId,
      imageUrl,
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
      insights
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

export const getSkinScanReports = async (req, res) => {
  try {
    const userId = req.userId;
    const entries = await SkinScanReport.find({ user: userId }).sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

export const deleteSkinScanReport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const deleted = await SkinScanReport.findOneAndDelete({ _id: id, user: userId });
    if (!deleted) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};
