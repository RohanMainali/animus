import Reminder from '../models/Reminder.js';

export const createReminder = async (req, res) => {
  try {
    const { type, message, dateTime, repeat } = req.body;
    const userId = req.userId;
    const reminder = new Reminder({
      user: userId,
      type,
      message,
      dateTime,
      repeat
    });
    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

export const getReminders = async (req, res) => {
  try {
    const userId = req.userId;
    const reminders = await Reminder.find({ user: userId });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

export const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const updated = await Reminder.findOneAndUpdate(
      { _id: id, user: userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Reminder not found.' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

export const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const deleted = await Reminder.findOneAndDelete({ _id: id, user: userId });
    if (!deleted) return res.status(404).json({ message: 'Reminder not found.' });
    res.json({ message: 'Reminder deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};
