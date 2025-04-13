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
  special: [{
    type: String,
  }],
  other: [{
    type: String,
  }],
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