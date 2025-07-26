import express from 'express';
import { createMedicalHistory, deleteMedicalHistory, getMedicalHistories, updateMedicalHistory } from '../controllers/medicalHistoryController.js';
import { getUserFromToken } from '../controllers/userController.js';

const router = express.Router();

// Get all medical history records for user
router.get('/', getUserFromToken, getMedicalHistories);

// Create new medical history record
router.post('/', getUserFromToken, createMedicalHistory);

// Update medical history record
router.put('/:id', getUserFromToken, updateMedicalHistory);

// Delete medical history record
router.delete('/:id', getUserFromToken, deleteMedicalHistory);

export default router;
