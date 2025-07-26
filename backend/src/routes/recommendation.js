import express from 'express';
import { getRecommendations } from '../controllers/recommendationController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// POST /api/recommendations
router.post('/', auth, getRecommendations);

export default router;
