import express from 'express';
import { getProfile, getUserFromToken, updateProfile } from '../controllers/userController.js';

const router = express.Router();

// Get user profile
router.get('/profile', getUserFromToken, getProfile);

// Update user profile
router.put('/profile', getUserFromToken, updateProfile);

export default router;
