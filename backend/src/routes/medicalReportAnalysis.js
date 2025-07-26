import express from 'express';
import { createMedicalReportAnalysis, deleteMedicalReportAnalysis, getMedicalReportAnalyses } from '../controllers/medicalReportAnalysisController.js';
import { getUserFromToken } from '../controllers/userController.js';

const router = express.Router();

// Get all medical report analyses for user
router.get('/', getUserFromToken, getMedicalReportAnalyses);

// Create new medical report analysis
router.post('/', getUserFromToken, createMedicalReportAnalysis);

// Delete medical report analysis
router.delete('/:id', getUserFromToken, deleteMedicalReportAnalysis);

export default router;
