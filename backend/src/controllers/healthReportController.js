import HealthReport from '../models/HealthReport.js';

export const createHealthReport = async (req, res) => {
  try {
    const { reportType, result, doctorFeedback, date } = req.body;
    const userId = req.userId;
    const report = new HealthReport({
      user: userId,
      reportType,
      result,
      doctorFeedback,
      date
    });
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

export const getHealthReports = async (req, res) => {
  try {
    const userId = req.userId;
    const reports = await HealthReport.find({ user: userId });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

export const updateHealthReport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const updated = await HealthReport.findOneAndUpdate(
      { _id: id, user: userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Report not found.' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

export const deleteHealthReport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const deleted = await HealthReport.findOneAndDelete({ _id: id, user: userId });
    if (!deleted) return res.status(404).json({ message: 'Report not found.' });
    res.json({ message: 'Report deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};
