import mongoose from 'mongoose';

const medicalHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  condition: { type: String, required: true },
  description: { type: String },
  dateDiagnosed: { type: Date },
  isActive: { type: Boolean, default: true },
  referenceId: { type: String, required: false, unique: false }, // e.g. vitalsId or analysisId
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('MedicalHistory', medicalHistorySchema);
