import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    image: {
      url: { type: String, required: true },
      alt: { type: String, required: true },
    },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

categorySchema.index({ slug: 1 }, { unique: true });

export default mongoose.models.Category ||
  mongoose.model('Category', categorySchema);
