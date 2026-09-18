import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a property title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a detailed description'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    propertyType: {
      type: String,
      required: [true, 'Please specify property type'],
      enum: ['Apartment', 'Villa', 'Independent House', 'Studio', 'Penthouse', 'Gated Community'],
      default: 'Apartment',
    },
    price: {
      type: Number,
      required: [true, 'Please specify monthly rent price'],
      min: [1000, 'Price must be at least ₹1,000/month'],
    },
    securityDeposit: {
      type: Number,
      default: function () {
        return this.price * 2;
      },
    },
    address: {
      type: String,
      required: [true, 'Please add physical street address'],
    },
    city: {
      type: String,
      required: [true, 'Please specify city'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'Please specify state/province'],
      trim: true,
    },
    pincode: {
      type: String,
      default: '',
    },
    bedrooms: {
      type: Number,
      required: [true, 'Please specify number of bedrooms'],
      min: [1, 'At least 1 bedroom'],
      max: [15, 'Maximum 15 bedrooms'],
    },
    bathrooms: {
      type: Number,
      required: [true, 'Please specify number of bathrooms'],
      min: [1, 'At least 1 bathroom'],
    },
    areaSqFt: {
      type: Number,
      required: [true, 'Please specify area in Sq Ft'],
      min: [100, 'Area must be at least 100 Sq Ft'],
    },
    furnishing: {
      type: String,
      enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
      default: 'Semi-Furnished',
    },
    amenities: {
      type: [String],
      default: ['WiFi', 'Parking', 'Security'],
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    videoTourUrl: {
      type: String,
      default: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    adminFeedback: {
      type: String,
      default: '',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    ratingsAverage: {
      type: Number,
      default: 4.8,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for fast search and filter queries
propertySchema.index({ city: 1, price: 1, propertyType: 1, status: 1 });
propertySchema.index({ title: 'text', description: 'text', address: 'text', city: 'text' });

const Property = mongoose.model('Property', propertySchema);
export default Property;
