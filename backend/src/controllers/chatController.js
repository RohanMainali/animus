import { chatWithLLM } from '../services/chatService.js';

export const chatBot = async (req, res) => {
  try {
    const { messages, maxTokens } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Messages array required.' });
    }
    const aiRes = await chatWithLLM(messages, maxTokens || 50);
    res.status(200).json(aiRes);
  } catch (error) {
    res.status(500).json({ message: 'AI chatbot error.', error });
  }
};
