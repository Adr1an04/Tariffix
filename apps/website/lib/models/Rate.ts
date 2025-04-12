import mongoose from 'mongoose';

const rateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  features: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Rate = mongoose.models.Rate || mongoose.model('Rate', rateSchema); 