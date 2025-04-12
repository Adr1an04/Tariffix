import mongoose from 'mongoose';

const rateSchema = new mongoose.Schema({
  htsno: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  general: {
    type: String,
    required: true,
  },
  other: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Rate = mongoose.models.Rate || mongoose.model('Rate', rateSchema); 