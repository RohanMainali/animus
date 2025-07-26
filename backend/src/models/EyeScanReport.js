import mongoose from 'mongoose';

const EyeScanReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  short_summary: { type: String },
  analysis: { type: String },
  confidence: { type: Number },
  scan_details: { type: String },
  insights: { type: String },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('EyeScanReport', EyeScanReportSchema);
