import mongoose from 'mongoose';

// Define the schema for a rate
const RateSchema = new mongoose.Schema({
  htsno: { type: String },
  description: { type: String },
  general: { type: String },
  other: { type: String }
}, { timestamps: true }); // Optional: adds createdAt and updatedAt

// Create and export the model
export const Rate = mongoose.models.Rate || mongoose.model('Rate', RateSchema);
