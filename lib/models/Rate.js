import mongoose, { Types } from 'mongoose';

const rateSchema = new mongoose.Schema({
  _id: {
    type: Types.ObjectId,
  },

  htsno: {
    type: String,
  },
  description: {
    type: String,
  },
  general: {
    type: String,
  },
  special: {
    type: String,
  },
  other: {
    type: String,
  },
  }

);

export const Rate = mongoose.models.Rate || mongoose.model('Rate', rateSchema); 