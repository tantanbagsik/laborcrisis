import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  salary: { type: String },
  salaryType: { type: String, enum: ['monthly', 'yearly', 'hourly'] },
  jobType: { 
    type: String, 
    enum: ['full-time', 'part-time', 'contract', 'temporary'],
    required: true 
  },
  workType: {
    type: String,
    enum: ['onsite', 'remote', 'hybrid'],
    default: 'onsite'
  },
  category: { type: String, required: true },
  status: { type: String, enum: ['active', 'closed', 'draft'], default: 'active' },
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
});

jobSchema.index({ title: 'text', description: 'text', company: 'text' });

export const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
