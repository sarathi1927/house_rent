import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

// @desc    Get system-wide platform statistics
// @route   GET /api/stats/platform
// @access  Public / Admin
export const getPlatformStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const approvedProperties = await Property.countDocuments({ status: 'approved' });
    const pendingProperties = await Property.countDocuments({ status: 'pending' });
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });

    // Distinct cities
    const cities = await Property.distinct('city', { status: 'approved' });

    // Recent properties
    const recentProperties = await Property.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(4)
      .select('title price city propertyType images bedrooms bathrooms');

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProperties,
        approvedProperties,
        pendingProperties,
        totalBookings,
        confirmedBookings,
        activeCities: cities.length,
        citiesList: cities,
      },
      recentProperties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get owner specific dashboard analytics
// @route   GET /api/stats/owner
// @access  Private (Owner or Admin)
export const getOwnerStats = async (req, res, next) => {
  try {
    const ownerId = req.user._id;

    const myPropertiesCount = await Property.countDocuments({ owner: ownerId });
    const myApprovedCount = await Property.countDocuments({ owner: ownerId, status: 'approved' });
    const myPendingCount = await Property.countDocuments({ owner: ownerId, status: 'pending' });
    
    const incomingBookings = await Booking.countDocuments({ owner: ownerId });
    const pendingRequests = await Booking.countDocuments({ owner: ownerId, status: 'pending' });
    const confirmedBookings = await Booking.find({ owner: ownerId, status: 'confirmed' });

    const monthlyRentalRevenue = confirmedBookings.reduce(
      (acc, booking) => acc + (booking.monthlyRent || 0),
      0
    );

    res.json({
      success: true,
      stats: {
        myPropertiesCount,
        myApprovedCount,
        myPendingCount,
        incomingBookings,
        pendingRequests,
        confirmedRentals: confirmedBookings.length,
        monthlyRentalRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};
