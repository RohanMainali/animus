import express from 'express';
import { createHealthReport, deleteHealthReport, getHealthReports, updateHealthReport } from '../controllers/healthReportController.js';
import { getUserFromToken } from '../controllers/userController.js';

const router = express.Router();

// Get all health reports for user
router.get('/', getUserFromToken, getHealthReports);

// Create new health report
router.post('/', getUserFromToken, createHealthReport);

// Update health report
router.put('/:id', getUserFromToken, updateHealthReport);

// Delete health report
router.delete('/:id', getUserFromToken, deleteHealthReport);

export default router;
