
import Vitals from '../models/Vitals.js';
import { analyzeTextWithLLM } from '../services/aiService.js';

export const createVitals = async (req, res) => {
  try {
    const { heartRate, bpSystolic, bpDiastolic, temperature, o2 } = req.body;
    const userId = req.userId;

    // Compose prompt for AI
    const prompt = `Patient Vitals:\nHeart Rate: ${heartRate}\nBP Systolic: ${bpSystolic}\nBP Diastolic: ${bpDiastolic}\nTemperature: ${temperature}\nO2: ${o2}`;
    let aiRes = {};
    let analysis = '';
    let confidence = null;
    let scan_details = '';
    let insights = '';
    try {
      aiRes = await analyzeTextWithLLM(prompt, 150, 'vitals');
      analysis = aiRes.analysis || aiRes.message || '';
      confidence = aiRes.confidence !== undefined ? aiRes.confidence : null;
      scan_details = aiRes.scan_details || '';
      insights = aiRes.insights || '';

      // If analysis is a stringified JSON, parse and extract all fields
      if (typeof analysis === 'string') {
        try {
          const parsed = JSON.parse(analysis);
          if (parsed && typeof parsed === 'object' && parsed.analysis) {
            analysis = parsed.analysis;
            if (parsed.confidence !== undefined && parsed.confidence !== null) confidence = parsed.confidence;
            if (parsed.scan_details) scan_details = parsed.scan_details;
            if (parsed.insights) insights = parsed.insights;
          }
        } catch (e) {
          // Not a JSON string, keep as is
        }
      }
    } catch (aiErr) {
      analysis = 'AI analysis failed.';
    }

    const vitals = new Vitals({
      user: userId,
      heartRate,
      bpSystolic,
      bpDiastolic,
      temperature,
      o2,
      analysis,
      confidence,
      scan_details,
      insights
    });
    await vitals.save();
    res.status(201).json({
      ...vitals.toObject(),
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

export const getVitals = async (req, res) => {
  try {
    const userId = req.userId;
    const vitals = await Vitals.find({ user: userId });
    res.json(vitals);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

export const updateVitals = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const updated = await Vitals.findOneAndUpdate(
      { _id: id, user: userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Vitals not found.' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

export const deleteVitals = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const deleted = await Vitals.findOneAndDelete({ _id: id, user: userId });
    if (!deleted) return res.status(404).json({ message: 'Vitals not found.' });
    res.json({ message: 'Vitals deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

