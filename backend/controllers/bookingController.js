import Booking from '../models/Booking.js';
import Property from '../models/Property.js';

// @desc    Create a new booking request
// @route   POST /api/bookings
// @access  Private (Tenant/User)
export const createBooking = async (req, res, next) => {
  try {
    const { propertyId, moveInDate, durationMonths, tenantMessage } = req.body;

    if (!propertyId || !moveInDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide property ID and intended move-in date',
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'This property is not currently approved for bookings',
      });
    }

    // Check if user is trying to book their own property
    if (property.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot rent your own property listing',
      });
    }

    // Check if user already has an active pending or confirmed booking for this property
    const existingActiveBooking = await Booking.findOne({
      property: propertyId,
      tenant: req.user._id,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingActiveBooking) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active or pending booking request for this property',
      });
    }

    const booking = await Booking.create({
      property: propertyId,
      tenant: req.user._id,
      owner: property.owner,
      moveInDate,
      durationMonths: durationMonths || 11,
      monthlyRent: property.price,
      totalDeposit: property.securityDeposit || property.price * 2,
      tenantMessage: tenantMessage || '',
      status: 'pending',
      paymentStatus: 'unpaid',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('property', 'title price address city images')
      .populate('owner', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Rental booking request submitted to the landlord successfully!',
      booking: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current tenant's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (Tenant/User)
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ tenant: req.user._id })
      .populate('property', 'title price address city propertyType images bedrooms bathrooms status')
      .populate('owner', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking requests received by a property owner
// @route   GET /api/bookings/owner-requests
// @access  Private (Owner or Admin)
export const getOwnerBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate('property', 'title price address city images')
      .populate('tenant', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Approve/Reject by owner or admin)
// @route   PUT /api/bookings/:id/status
// @access  Private (Owner or Admin)
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, ownerNotes } = req.body;

    if (!['confirmed', 'rejected', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be confirmed, rejected, or cancelled.',
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Verify user is property owner or admin
    if (
      booking.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to manage this booking request',
      });
    }

    booking.status = status;
    if (ownerNotes !== undefined) booking.ownerNotes = ownerNotes;

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('property', 'title price address city images')
      .populate('tenant', 'name email phone');

    res.json({
      success: true,
      message: `Booking request marked as ${status}`,
      booking: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Tenant cancels their own booking request
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Tenant)
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.tenant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking request cancelled successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};
