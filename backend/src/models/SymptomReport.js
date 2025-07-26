import mongoose from 'mongoose';

const symptomReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symptoms: { type: String, required: true },
  short_summary: { type: String }, // 3-5 word summary
  analysis: { type: String },
  confidence: { type: Number },
  scan_details: { type: String },
  insights: { type: String },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('SymptomReport', symptomReportSchema);
