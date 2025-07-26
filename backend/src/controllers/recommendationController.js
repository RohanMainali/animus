import MedicalHistory from '../models/MedicalHistory.js';
import { analyzeTextWithLLM } from '../services/aiService.js';

// POST /api/recommendations
export const getRecommendations = async (req, res) => {
  try {
    const { analysis, userId, scanType, scanData, vitalsId } = req.body;
    if (!analysis) return res.status(400).json({ message: 'Analysis is required.' });

    // Compose prompt for recommendations
    const prompt = `Given the following analysis, provide:\n- Detailed, actionable recommendations or next steps\n- Urgency to visit a doctor (Low | Medium | High)\n- isMedicalCondition: 1 if this is a medical condition, 0 if not\n\nAnalysis: ${analysis}`;

    const aiRes = await analyzeTextWithLLM(prompt, 200, 'recommendation');
    const { insights, urgency, isMedicalCondition } = aiRes;

    // Save to medical history if isMedicalCondition === 1
    let savedHistory = null;
    if (isMedicalCondition === 1 && userId) {
      savedHistory = await MedicalHistory.create({
        user: userId,
        scanType,
        scanData,
        analysis,
        recommendations: insights,
        urgency,
        vitalsId: vitalsId || null,
        date: new Date(),
      });
    }

    res.json({
      recommendations: insights,
      urgency,
      isMedicalCondition,
      savedHistory,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};
