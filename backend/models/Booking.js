import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    moveInDate: {
      type: Date,
      required: [true, 'Please specify planned move-in date'],
    },
    durationMonths: {
      type: Number,
      default: 11,
      min: [1, 'Rental lease duration must be at least 1 month'],
      max: [60, 'Maximum rental duration is 60 months'],
    },
    monthlyRent: {
      type: Number,
      required: true,
    },
    totalDeposit: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },
    tenantMessage: {
      type: String,
      default: '',
    },
    ownerNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ tenant: 1, property: 1 });
bookingSchema.index({ owner: 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
