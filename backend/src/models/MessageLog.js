import mongoose from 'mongoose';

const messageLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  number: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['success','failed'], required: true },
  error: { type: String },
  attempt: { type: Number, default: 1 },
}, { timestamps: true });

export default mongoose.model('MessageLog', messageLogSchema);
