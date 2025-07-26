import express from 'express';
import { createGoal, deleteGoal, getGoals, updateGoal } from '../controllers/goalController.js';
import { getUserFromToken } from '../controllers/userController.js';

const router = express.Router();

// Get all goals for user
router.get('/', getUserFromToken, getGoals);

// Create new goal
router.post('/', getUserFromToken, createGoal);

// Update goal
router.put('/:id', getUserFromToken, updateGoal);

// Delete goal
router.delete('/:id', getUserFromToken, deleteGoal);

export default router;
