import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, trim: true },
    label: { type: String, required: true },
    weightGrams: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0, validate: Number.isInteger },
    mrp: { type: Number, required: true, min: 0, validate: Number.isInteger },
    stock: { type: Number, required: true, min: 0, validate: Number.isInteger },
    reserved: { type: Number, default: 0, min: 0, validate: Number.isInteger },
    lowStockThreshold: { type: Number, required: true, min: 0, validate: Number.isInteger },
    shippingWeightGrams: { type: Number, required: true, min: 1 },
    dimensionsCm: {
      length: { type: Number, required: true, min: 0 },
      width: { type: Number, required: true, min: 0 },
      height: { type: Number, required: true, min: 0 },
    },
    isActive: { type: Boolean, default: true },
  },
  { _id: true },
);

variantSchema.pre('validate', function validateMrp(next) {
  if (this.mrp < this.price) {
    this.invalidate('mrp', 'mrp must be greater than or equal to price');
  }
  next();
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, required: true },
      },
    ],
    variants: { type: [variantSchema], required: true },
    origin: { region: { type: String, default: null } },
    certifications: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    soldCount: { type: Number, default: 0, min: 0, validate: Number.isInteger },
  },
  { timestamps: true },
);

productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ 'variants.sku': 1 }, { unique: true, sparse: true });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.models.Product ||
  mongoose.model('Product', productSchema);
