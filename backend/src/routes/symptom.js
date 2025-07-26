import express from 'express';
import { createSymptom, deleteSymptom, getSymptoms } from '../controllers/symptomController.js';
import { getUserFromToken } from '../controllers/userController.js';

const router = express.Router();

// Get all symptom entries for user
router.get('/', getUserFromToken, getSymptoms);

// Create new symptom entry
router.post('/', getUserFromToken, createSymptom);

// Delete symptom entry
router.delete('/:id', getUserFromToken, deleteSymptom);

export default router;