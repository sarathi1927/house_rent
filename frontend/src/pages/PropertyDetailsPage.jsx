import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { propertiesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/bookings/BookingModal';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Calendar,
  CheckCircle,
  Star,
  Phone,
  Mail,
  Share2,
  Heart,
  Video,
  ShieldCheck,
  Send,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Review form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const res = await propertiesAPI.getById(id);
      if (res.data.success) {
        setProperty(res.data.property);
        setReviews(res.data.reviews || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Property not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!isAuthenticated) {
      setReviewError('Please login to post a review.');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await propertiesAPI.addReview(id, {
        rating: Number(newRating),
        comment: newComment,
      });

      if (res.data.success) {
        setReviewSuccess('Thank you! Your review has been published.');
        setReviews([res.data.review, ...reviews]);
        setNewComment('');
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 min-vh-50">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading property...</span>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container py-5 text-center">
        <AlertCircle size={50} className="text-danger mb-3" />
        <h3 className="fw-bold">Property Not Found</h3>
        <p className="text-muted mb-4">{error || 'The requested property listing does not exist.'}</p>
        <Link to="/properties" className="btn btn-househunt-primary">
          Back to Listings
        </Link>
      </div>
    );
  }

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80'];

  return (
    <div className="py-4 bg-light min-vh-100">
      <div className="container">
        {/* Breadcrumb & Navigation */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <Link to="/properties" className="text-secondary fw-semibold small d-inline-flex align-items-center gap-1">
            <ArrowLeft size={16} /> Back to Search
          </Link>
          <div className="d-flex gap-2">
            <span className="badge-pill-modern badge-type">{property.propertyType}</span>
            {property.status !== 'approved' && (
              <span className="badge-pill-modern badge-pending">Status: {property.status}</span>
            )}
          </div>
        </div>

        {/* Title & Location Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start mb-4 gap-2">
          <div>
            <h1 className="fw-bold text-dark brand-font mb-2">{property.title}</h1>
            <div className="d-flex align-items-center text-muted">
              <MapPin size={16} className="text-danger me-1 flex-shrink-0" />
              <span>{property.address}, {property.city}, {property.state} - {property.pincode}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded-3 border shadow-sm flex-shrink-0">
            <Star size={20} className="text-warning fill-warning" />
            <div>
              <div className="fw-bold text-dark fs-5">{property.ratingsAverage || 4.8} / 5.0</div>
              <div className="text-muted small">({property.ratingsCount || reviews.length} verified reviews)</div>
            </div>
          </div>
        </div>

        {/* Main Gallery Section */}
        <div className="row g-3 mb-4">
          <div className="col-12">
            <img
              src={images[activeImageIndex]}
              alt={property.title}
              className="gallery-main"
            />
          </div>
          {images.length > 1 && (
            <div className="col-12">
              <div className="row g-2">
                {images.map((img, idx) => (
                  <div key={idx} className="col-3 col-md-2">
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className={`gallery-thumb ${activeImageIndex === idx ? 'active' : ''}`}
                      onClick={() => setActiveImageIndex(idx)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content & Sidebar Columns */}
        <div className="row g-4">
          {/* Left Column: Details */}
          <div className="col-lg-8">
            {/* Quick Specs Highlights Card */}
            <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
              <h5 className="fw-bold text-dark mb-3">Property Overview</h5>
              <div className="row g-3 text-center">
                <div className="col-4 col-md-2">
                  <div className="p-2 rounded-3 bg-light">
                    <Bed size={22} className="text-primary mb-1" />
                    <div className="fw-bold text-dark">{property.bedrooms} Beds</div>
                    <div className="text-muted small">Bedrooms</div>
                  </div>
                </div>
                <div className="col-4 col-md-2">
                  <div className="p-2 rounded-3 bg-light">
                    <Bath size={22} className="text-primary mb-1" />
                    <div className="fw-bold text-dark">{property.bathrooms} Baths</div>
                    <div className="text-muted small">Bathrooms</div>
                  </div>
                </div>
                <div className="col-4 col-md-3">
                  <div className="p-2 rounded-3 bg-light">
                    <Maximize2 size={22} className="text-primary mb-1" />
                    <div className="fw-bold text-dark">{property.areaSqFt} Sq Ft</div>
                    <div className="text-muted small">Carpet Area</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-2 rounded-3 bg-light">
                    <div className="fw-bold text-dark mt-1">{property.furnishing}</div>
                    <div className="text-muted small">Furnishing</div>
                  </div>
                </div>
                <div className="col-6 col-md-2">
                  <div className="p-2 rounded-3 bg-light">
                    <div className="fw-bold text-success mt-1">Ready</div>
                    <div className="text-muted small">Availability</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
              <h5 className="fw-bold text-dark mb-3">About this Property</h5>
              <p className="text-secondary leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                {property.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
              <h5 className="fw-bold text-dark mb-3">Included Amenities & Services</h5>
              <div className="d-flex flex-wrap gap-2">
                {property.amenities && property.amenities.length > 0 ? (
                  property.amenities.map((amenity, index) => (
                    <div key={index} className="amenity-chip">
                      <CheckCircle size={16} className="text-success flex-shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-muted">No specific amenities listed.</span>
                )}
              </div>
            </div>

            {/* Virtual Tour Video Preview */}
            {property.videoTourUrl && (
              <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Video size={20} className="text-danger" />
                  <h5 className="fw-bold text-dark mb-0">Virtual 3D Walkthrough Tour</h5>
                </div>
                <div className="ratio ratio-16x9 rounded-3 overflow-hidden border">
                  <iframe
                    src={property.videoTourUrl}
                    title="Virtual Property Tour"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="text-muted small mt-2 mb-0">
                  Inspect the architectural layout and interior fixtures virtually before booking an in-person visit.
                </p>
              </div>
            )}

            {/* Tenant Reviews Section */}
            <div className="bg-white p-4 rounded-4 shadow-sm border">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-dark mb-0">
                  Tenant Feedback & Reviews ({reviews.length})
                </h5>
              </div>

              {/* Add Review Form */}
              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} className="p-3 bg-light rounded-3 mb-4">
                  <h6 className="fw-bold text-dark mb-2">Leave a Verified Review</h6>
                  {reviewError && <div className="alert alert-danger py-2 small mb-2">{reviewError}</div>}
                  {reviewSuccess && <div className="alert alert-success py-2 small mb-2">{reviewSuccess}</div>}

                  <div className="d-flex align-items-center gap-3 mb-3">
                    <label className="small fw-semibold text-secondary mb-0">Rating:</label>
                    <select
                      className="form-select form-select-sm"
                      style={{ width: 140 }}
                      value={newRating}
                      onChange={(e) => setNewRating(e.target.value)}
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                      <option value="4">⭐⭐⭐⭐ (4/5)</option>
                      <option value="3">⭐⭐⭐ (3/5)</option>
                      <option value="2">⭐⭐ (2/5)</option>
                      <option value="1">⭐ (1/5)</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <textarea
                      rows="2"
                      className="form-control form-control-modern"
                      placeholder="Share your experience regarding property condition, maintenance, or landlord communication..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-sm btn-househunt-primary"
                    disabled={submittingReview}
                  >
                    <Send size={14} /> Submit Review
                  </button>
                </form>
              ) : (
                <div className="p-3 bg-light rounded-3 text-center mb-4">
                  <p className="text-muted small mb-2">Have you rented or visited this property?</p>
                  <Link to="/login" className="btn btn-sm btn-outline-primary">
                    Log in to post a review
                  </Link>
                </div>
              )}

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <p className="text-muted small">No reviews submitted for this property yet.</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {reviews.map((rev) => (
                    <div key={rev._id} className="p-3 border rounded-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={rev.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                            alt={rev.user?.name}
                            className="rounded-circle"
                            style={{ width: 32, height: 32, objectFit: 'cover' }}
                          />
                          <span className="fw-semibold text-dark small">{rev.user?.name}</span>
                        </div>
                        <div className="d-flex align-items-center text-warning small">
                          {'★'.repeat(rev.rating)}
                          <span className="text-muted ms-1">({rev.rating}/5)</span>
                        </div>
                      </div>
                      <p className="text-secondary small mb-1">{rev.comment}</p>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                        {new Date(rev.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Pricing & Booking Action Card */}
          <div className="col-lg-4">
            <div className="sticky-top" style={{ top: '5.5rem' }}>
              <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
                {/* Price Display */}
                <div className="mb-3">
                  <span className="text-muted small text-uppercase fw-semibold">Monthly Rent</span>
                  <div className="d-flex align-items-baseline gap-1">
                    <span className="display-6 fw-bolder text-primary brand-font">
                      {formatPrice(property.price)}
                    </span>
                    <span className="text-muted">/ month</span>
                  </div>
                </div>

                <div className="p-3 bg-light rounded-3 mb-4">
                  <div className="d-flex justify-content-between small text-secondary mb-1">
                    <span>Security Deposit:</span>
                    <span className="fw-bold text-dark">
                      {formatPrice(property.securityDeposit || property.price * 2)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between small text-secondary mb-1">
                    <span>Notice Period:</span>
                    <span className="fw-semibold text-dark">1 Month</span>
                  </div>
                  <div className="d-flex justify-content-between small text-secondary">
                    <span>Maintenance:</span>
                    <span className="text-success fw-semibold">Included in Rent</span>
                  </div>
                </div>

                {/* Booking Button */}
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="btn btn-househunt-primary w-100 py-3 mb-3 fw-bold fs-6"
                >
                  Request Rental Booking
                </button>

                <div className="text-center small text-muted d-flex align-items-center justify-content-center gap-1">
                  <ShieldCheck size={16} className="text-success" />
                  <span>Free cancellation before landlord confirmation</span>
                </div>
              </div>

              {/* Landlord Profile Card */}
              <div className="bg-white p-4 rounded-4 shadow-sm border">
                <h6 className="fw-bold text-dark text-uppercase small mb-3">Listed By Landlord</h6>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <img
                    src={property.owner?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                    alt={property.owner?.name}
                    className="rounded-circle shadow-sm"
                    style={{ width: 56, height: 56, objectFit: 'cover' }}
                  />
                  <div>
                    <h6 className="fw-bold text-dark mb-0">{property.owner?.name || 'Property Owner'}</h6>
                    <span className="badge bg-success-subtle text-success small fw-semibold">
                      Verified Host
                    </span>
                  </div>
                </div>

                <p className="text-muted small mb-3">
                  {property.owner?.bio || 'Experienced property owner on HouseHunt.'}
                </p>

                <div className="d-flex flex-column gap-2 small text-secondary">
                  {property.owner?.email && (
                    <div className="d-flex align-items-center gap-2">
                      <Mail size={15} className="text-primary" />
                      <span>{property.owner.email}</span>
                    </div>
                  )}
                  {property.owner?.phone && (
                    <div className="d-flex align-items-center gap-2">
                      <Phone size={15} className="text-primary" />
                      <span>{property.owner.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        property={property}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={() => {
          navigate('/dashboard');
        }}
      />
    </div>
  );
};

export default PropertyDetailsPage;
