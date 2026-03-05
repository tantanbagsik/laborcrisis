import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'reviewing', 'interview', 'rejected', 'hired'],
    default: 'pending' 
  },
  coverLetter: { type: String },
  resume: { type: String },
  notes: { type: String },
  appliedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);
