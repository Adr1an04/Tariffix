import mongoose, { Schema, Types } from 'mongoose';

// Define the schema for a rate
const RateSchema = new mongoose.Schema({
  _id: { type: Schema.Types.Object.Id},
  description: { type: String},
  htsno: { type: String },
  general: { type: String },
  special: { type: String },
  other: { type: String },
}, { timestamps: true }); // Optional: adds createdAt and updatedAt

// Create and export the model
export const Rate = mongoose.models.Rate || mongoose.model('Rate', RateSchema);