import mongoose from 'mongoose';

const vitalsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  heartRate: { type: String, required: true },
  bpSystolic: { type: String, required: true },
  bpDiastolic: { type: String, required: true },
  temperature: { type: String, required: true },
  o2: { type: String },
  analysis: { type: String },
  confidence: { type: Number },
  scan_details: { type: String },
  insights: { type: String },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Vitals', vitalsSchema);

