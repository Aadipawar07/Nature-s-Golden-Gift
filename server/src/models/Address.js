import mongoose from 'mongoose';
import { ADDRESS_TYPES } from '@ngg/shared/account';

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true },
    pincode: { type: String, required: true },
    line1: { type: String, required: true, trim: true, maxlength: 160 },
    line2: { type: String, trim: true, maxlength: 160 },
    landmark: { type: String, trim: true, maxlength: 120 },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    state: { type: String, required: true, trim: true, maxlength: 100 },
    type: {
      type: String,
      enum: Object.values(ADDRESS_TYPES),
      default: ADDRESS_TYPES.HOME,
      required: true,
    },
    isDefault: { type: Boolean, default: false, required: true },
    isDeleted: { type: Boolean, default: false, required: true },
  },
  { timestamps: true },
);

addressSchema.index({ userId: 1, isDeleted: 1, isDefault: 1 });

export default mongoose.models.Address ||
  mongoose.model('Address', addressSchema);
