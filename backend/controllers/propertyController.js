import Property from '../models/Property.js';
import Review from '../models/Review.js';

// @desc    Get all properties with advanced search, filtering & pagination
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res, next) => {
  try {
    const {
      keyword,
      city,
      state,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      furnishing,
      amenities,
      sortBy,
      page = 1,
      limit = 12,
      includePending,
    } = req.query;

    const query = {};

    // By default, public search only displays approved properties
    if (includePending === 'true') {
      // allow all statuses if requested by admin or internal query
    } else {
      query.status = 'approved';
    }

    // Text search by keyword
    if (keyword && keyword.trim() !== '') {
      const regex = new RegExp(keyword.trim(), 'i');
      query.$or = [
        { title: regex },
        { description: regex },
        { city: regex },
        { address: regex },
      ];
    }

    // Exact or partial city filter
    if (city && city.trim() !== '') {
      query.city = new RegExp(`^${city.trim()}$`, 'i');
    }

    // State filter
    if (state && state.trim() !== '') {
      query.state = new RegExp(state.trim(), 'i');
    }

    // Property Type filter
    if (propertyType && propertyType !== 'All') {
      query.propertyType = propertyType;
    }

    // Price Range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Bedrooms
    if (bedrooms && bedrooms !== 'All') {
      if (bedrooms === '4+') {
        query.bedrooms = { $gte: 4 };
      } else {
        query.bedrooms = Number(bedrooms);
      }
    }

    // Bathrooms
    if (bathrooms && bathrooms !== 'All') {
      query.bathrooms = { $gte: Number(bathrooms) };
    }

    // Furnishing
    if (furnishing && furnishing !== 'All') {
      query.furnishing = furnishing;
    }

    // Amenities (WiFi, Parking, Gym, etc.)
    if (amenities) {
      const amenitiesList = Array.isArray(amenities)
        ? amenities
        : amenities.split(',').map((a) => a.trim());
      if (amenitiesList.length > 0) {
        query.amenities = { $all: amenitiesList };
      }
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sortBy === 'price-asc') sortOptions = { price: 1 };
    else if (sortBy === 'price-desc') sortOptions = { price: -1 };
    else if (sortBy === 'rating') sortOptions = { ratingsAverage: -1 };
    else if (sortBy === 'area') sortOptions = { areaSqFt: -1 };

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('owner', 'name email phone avatar')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: properties.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property details with owner info & reviews
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'owner',
      'name email phone avatar createdAt bio'
    );

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Fetch reviews
    const reviews = await Review.find({ property: property._id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      property,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new property listing
// @route   POST /api/properties
// @access  Private (Owner or Admin)
export const createProperty = async (req, res, next) => {
  try {
    // If admin posts it, mark approved directly; if owner posts it, mark pending for admin review
    const initialStatus = req.user.role === 'admin' ? 'approved' : 'pending';

    const propertyData = {
      ...req.body,
      owner: req.user._id,
      status: initialStatus,
    };

    const property = await Property.create(propertyData);

    res.status(201).json({
      success: true,
      message:
        initialStatus === 'pending'
          ? 'Property listing submitted successfully! It is now pending admin moderation.'
          : 'Property published successfully!',
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing property
// @route   PUT /api/properties/:id
// @access  Private (Owner or Admin)
export const updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Check ownership or admin rights
    if (
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this property listing',
      });
    }

    // Don't let owner override approved/pending status directly via update
    if (req.user.role !== 'admin') {
      delete req.body.status;
      delete req.body.adminFeedback;
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Property updated successfully',
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private (Owner or Admin)
export const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Check authorization
    if (
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this property',
      });
    }

    await Property.findByIdAndDelete(req.params.id);
    // Remove related reviews
    await Review.deleteMany({ property: req.params.id });

    res.json({
      success: true,
      message: 'Property listing deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin moderation: Approve or Reject a property listing
// @route   PUT /api/properties/:id/status
// @access  Private (Admin only)
export const reviewPropertyStatus = async (req, res, next) => {
  try {
    const { status, adminFeedback } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be approved, rejected, or pending.',
      });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    property.status = status;
    if (adminFeedback !== undefined) {
      property.adminFeedback = adminFeedback;
    }

    await property.save();

    res.json({
      success: true,
      message: `Property listing ${status} successfully`,
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get properties owned by the authenticated user
// @route   GET /api/properties/my-properties
// @access  Private (Owner or Admin)
export const getMyProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get all pending listings for moderation
// @route   GET /api/properties/admin/pending
// @access  Private (Admin only)
export const getPendingProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ status: 'pending' })
      .populate('owner', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    next(error);
  }
};
