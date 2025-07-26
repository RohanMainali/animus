import express from 'express';
import { createSkinScanReport, deleteSkinScanReport, getSkinScanReports } from '../controllers/skinScanReportController.js';
import { getUserFromToken } from '../controllers/userController.js';

const router = express.Router();

// Get all skin scan reports for user
router.get('/', getUserFromToken, getSkinScanReports);

// Create new skin scan report
router.post('/', getUserFromToken, createSkinScanReport);

// Delete skin scan report
router.delete('/:id', getUserFromToken, deleteSkinScanReport);

export default router;
