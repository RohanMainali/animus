import express from 'express';
import { createEyeScanReport, deleteEyeScanReport, getEyeScanReports } from '../controllers/eyeScanReportController.js';
import { getUserFromToken } from '../controllers/userController.js';

const router = express.Router();

// Get all eye scan reports for user
router.get('/', getUserFromToken, getEyeScanReports);

// Create new eye scan report
router.post('/', getUserFromToken, createEyeScanReport);

// Delete eye scan report
router.delete('/:id', getUserFromToken, deleteEyeScanReport);

export default router;
