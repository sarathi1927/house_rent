import Review from '../models/Review.js';
import Property from '../models/Property.js';

// @desc    Add review for a property
// @route   POST /api/properties/:id/reviews
// @access  Private (Tenant/User)
export const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const propertyId = req.params.id;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both rating and review comment',
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      property: propertyId,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this property',
      });
    }

    const review = await Review.create({
      property: propertyId,
      user: req.user._id,
      rating: Number(rating),
      comment,
    });

    // Update Property average rating
    const allReviews = await Review.find({ property: propertyId });
    const avgRating =
      allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;

    property.ratingsAverage = Math.round(avgRating * 10) / 10;
    property.ratingsCount = allReviews.length;
    await property.save();

    const populatedReview = await Review.findById(review._id).populate(
      'user',
      'name avatar'
    );

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: populatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a property
// @route   GET /api/properties/:id/reviews
// @access  Public
export const getPropertyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ property: req.params.id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};
