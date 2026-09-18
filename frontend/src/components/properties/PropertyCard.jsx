import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize2, MapPin, Star, ShieldCheck, Sparkles } from 'lucide-react';

const PropertyCard = ({ property, showAdminControls, onStatusChange, onDelete }) => {
  const {
    _id,
    title,
    propertyType,
    price,
    city,
    address,
    bedrooms,
    bathrooms,
    areaSqFt,
    images,
    ratingsAverage,
    status,
    featured,
  } = property;

  const displayImage =
    images && images.length > 0
      ? images[0]
      : 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80';

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="property-card h-100 shadow-sm border position-relative">
      {/* Thumbnail */}
      <div className="property-img-container">
        <img
          src={displayImage}
          alt={title}
          className="property-img"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Top Badges */}
        <div className="position-absolute top-0 start-0 m-3 d-flex flex-wrap gap-1">
          <span className="badge-pill-modern badge-type shadow-sm">
            {propertyType}
          </span>
          {featured && (
            <span className="badge-pill-modern bg-warning text-dark shadow-sm">
              <Sparkles size={12} /> Featured
            </span>
          )}
        </div>

        {/* Status Badge if not standard approved or if in management view */}
        {status !== 'approved' && (
          <div className="position-absolute top-0 end-0 m-3">
            <span
              className={`badge-pill-modern ${
                status === 'pending'
                  ? 'badge-pending'
                  : 'badge-rejected'
              } shadow-sm`}
            >
              {status}
            </span>
          </div>
        )}

        {/* Rating overlay */}
        <div
          className="position-absolute bottom-0 end-0 m-2 px-2 py-1 rounded-pill bg-white shadow-sm d-flex align-items-center gap-1 text-dark"
          style={{ fontSize: '0.75rem', fontWeight: 600 }}
        >
          <Star size={13} className="text-warning fill-warning" />
          <span>{ratingsAverage || 4.8}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 d-flex flex-column flex-grow-1">
        {/* Price */}
        <div className="d-flex align-items-baseline justify-content-between mb-2">
          <div>
            <span className="fs-5 fw-bold text-primary brand-font">
              {formatPrice(price)}
            </span>
            <span className="text-muted small"> / month</span>
          </div>
          <span className="badge bg-light text-secondary border small">
            Deposit: {formatPrice(property.securityDeposit || price * 2)}
          </span>
        </div>

        {/* Title */}
        <h6 className="card-title fw-bold text-dark mb-1 text-truncate" title={title}>
          <Link to={`/properties/${_id}`} className="text-dark text-decoration-none hover-primary">
            {title}
          </Link>
        </h6>

        {/* Location */}
        <div className="d-flex align-items-center text-muted small mb-3 text-truncate">
          <MapPin size={14} className="me-1 text-danger flex-shrink-0" />
          <span className="text-truncate">{address}, {city}</span>
        </div>

        {/* Feature Icons Grid */}
        <div className="d-flex align-items-center justify-content-between py-2 px-3 bg-light rounded-3 mb-3 text-secondary small">
          <div className="d-flex align-items-center gap-1">
            <Bed size={15} className="text-primary" />
            <span>{bedrooms} Beds</span>
          </div>
          <div className="vr opacity-25"></div>
          <div className="d-flex align-items-center gap-1">
            <Bath size={15} className="text-primary" />
            <span>{bathrooms} Baths</span>
          </div>
          <div className="vr opacity-25"></div>
          <div className="d-flex align-items-center gap-1">
            <Maximize2 size={15} className="text-primary" />
            <span>{areaSqFt} sqft</span>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="mt-auto pt-2 border-top">
          {showAdminControls ? (
            <div className="d-flex gap-2">
              {status === 'pending' && (
                <>
                  <button
                    onClick={() => onStatusChange(_id, 'approved')}
                    className="btn btn-sm btn-success flex-grow-1 fw-semibold"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onStatusChange(_id, 'rejected')}
                    className="btn btn-sm btn-outline-danger flex-grow-1 fw-semibold"
                  >
                    Reject
                  </button>
                </>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(_id)}
                  className="btn btn-sm btn-outline-secondary"
                  title="Delete Listing"
                >
                  Delete
                </button>
              )}
            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-success small fw-semibold d-flex align-items-center gap-1">
                <ShieldCheck size={14} /> Verified Owner
              </span>
              <Link to={`/properties/${_id}`} className="btn btn-sm btn-househunt-primary px-3">
                View Details
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
