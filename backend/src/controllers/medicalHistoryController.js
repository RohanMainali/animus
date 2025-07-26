import MedicalHistory from '../models/MedicalHistory.js';

export const createMedicalHistory = async (req, res) => {
  try {
    const { condition, description, dateDiagnosed, isActive, referenceId } = req.body;
    const userId = req.userId;
    // Upsert: if a record with this referenceId and user exists, update it, else create new
    let record = await MedicalHistory.findOneAndUpdate(
      { user: userId, referenceId },
      {
        user: userId,
        condition,
        description,
        dateDiagnosed,
        isActive,
        referenceId
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

export const getMedicalHistories = async (req, res) => {
  try {
    const userId = req.userId;
    const records = await MedicalHistory.find({ user: userId });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

export const updateMedicalHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const updated = await MedicalHistory.findOneAndUpdate(
      { _id: id, user: userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Record not found.' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

export const deleteMedicalHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const deleted = await MedicalHistory.findOneAndDelete({ _id: id, user: userId });
    if (!deleted) return res.status(404).json({ message: 'Record not found.' });
    res.json({ message: 'Record deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};
