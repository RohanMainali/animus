import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import eyeScanReportRoutes from './routes/eyeScanReport.js';
import goalRoutes from './routes/goal.js';
import healthReportRoutes from './routes/healthReport.js';
import medicalHistoryRoutes from './routes/medicalHistory.js';
import medicalReportAnalysisRoutes from './routes/medicalReportAnalysis.js';
import recommendationRoutes from './routes/recommendation.js';
import reminderRoutes from './routes/reminder.js';
import skinScanReportRoutes from './routes/skinScanReport.js';
import symptomReportRoutes from './routes/symptomReport.js';
import userRoutes from './routes/user.js';
import vitalsRoutes from './routes/vitals.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Sample route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

// TODO: Add more routes here

// Skin scan routes
app.use('/api/skin-scan', skinScanReportRoutes);

// Eye scan routes
app.use('/api/eye-scan', eyeScanReportRoutes);

// Medical report analysis routes
app.use('/api/medical-report', medicalReportAnalysisRoutes);

// Auth routes
app.use('/api/auth', authRoutes);

// User profile routes
app.use('/api/user', userRoutes);

// Medical history routes
app.use('/api/medical-history', medicalHistoryRoutes);

// Health report routes
app.use('/api/health-report', healthReportRoutes);

// Vitals analysis routes
app.use('/api/vitals', vitalsRoutes);

// Recommendation routes
app.use('/api/recommendations', recommendationRoutes);

// Reminder routes
app.use('/api/reminders', reminderRoutes);


// Goals routes
app.use('/api/goals', goalRoutes);

// Symptoms routes (new)
app.use('/api/symptoms', symptomReportRoutes);

// Chat routes
app.use('/api/chat', chatRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
