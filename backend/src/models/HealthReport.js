import mongoose from 'mongoose';

const healthReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportType: { type: String, required: true }, // e.g. cardiac, skin, eye, etc.
  result: { type: String, required: true },
  doctorFeedback: { type: String },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('HealthReport', healthReportSchema);
