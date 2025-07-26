import express from 'express';
import { createSymptomReport, deleteSymptomReport, getSymptomReports, updateSymptomReport } from '../controllers/symptomReportController.js';
import { getUserFromToken } from '../controllers/userController.js';

const router = express.Router();

// Get all symptom reports for user
router.get('/', getUserFromToken, getSymptomReports);

// Create new symptom report
router.post('/', getUserFromToken, createSymptomReport);

// Update symptom report
router.put('/:id', getUserFromToken, updateSymptomReport);

// Delete symptom report
router.delete('/:id', getUserFromToken, deleteSymptomReport);

export default router;