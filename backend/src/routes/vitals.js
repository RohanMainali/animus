import express from 'express';
import { createVitals, deleteVitals, getVitals, updateVitals } from '../controllers/vitalsController.js';
import { getUserFromToken } from '../controllers/userController.js';

const router = express.Router();

// Get all vitals for user
router.get('/', getUserFromToken, getVitals);

// Create new vitals entry
router.post('/', getUserFromToken, createVitals);

// Update vitals entry
router.put('/:id', getUserFromToken, updateVitals);

// Delete vitals entry
router.delete('/:id', getUserFromToken, deleteVitals);

export default router;

