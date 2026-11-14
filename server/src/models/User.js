import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    name: { type: String, trim: true, maxlength: 100 },
    phone: { type: String, trim: true },
    role: {
      type: String,
      enum: ['CUSTOMER', 'ADMIN', 'SUPER_ADMIN'],
      default: 'CUSTOMER',
      required: true,
    },
    isActive: { type: Boolean, default: true, required: true },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model('User', userSchema);
