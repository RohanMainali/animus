import Goal from '../models/Goal.js';

export const createGoal = async (req, res) => {
  try {
    const { name, target, frequency, completed } = req.body;
    const userId = req.userId;
    const goal = new Goal({
      user: userId,
      name,
      target,
      frequency,
      completed: completed || false
    });
    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

export const getGoals = async (req, res) => {
  try {
    const userId = req.userId;
    const goals = await Goal.find({ user: userId });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const updated = await Goal.findOneAndUpdate(
      { _id: id, user: userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Goal not found.' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const deleted = await Goal.findOneAndDelete({ _id: id, user: userId });
    if (!deleted) return res.status(404).json({ message: 'Goal not found.' });
    res.json({ message: 'Goal deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};
