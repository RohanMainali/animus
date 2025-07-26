import express from 'express';
import { chatBot } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', chatBot);

export default router;
