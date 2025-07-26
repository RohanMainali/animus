import express from 'express';
import { createReminder, deleteReminder, getReminders, updateReminder } from '../controllers/reminderController.js';
import { getUserFromToken } from '../controllers/userController.js';

const router = express.Router();

// Get all reminders for user
router.get('/', getUserFromToken, getReminders);

// Create new reminder
router.post('/', getUserFromToken, createReminder);

// Update reminder
router.put('/:id', getUserFromToken, updateReminder);

// Delete reminder
router.delete('/:id', getUserFromToken, deleteReminder);

export default router;
