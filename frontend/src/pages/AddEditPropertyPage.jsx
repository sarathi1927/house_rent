import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { propertiesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Building,
  MapPin,
  DollarSign,
  Layers,
  Image as ImageIcon,
  Video,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Plus,
  Trash2,
} from 'lucide-react';

const ALL_AMENITIES = [
  'WiFi',
  'Air Conditioning',
  'Swimming Pool',
  'Gym',
  'Parking',
  'Power Backup',
  'Security',
  'Pet Friendly',
  'Club House',
  'Gas Pipeline',
];

const AddEditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'Apartment',
    price: '',
    securityDeposit: '',
    address: '',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '',
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1100,
    furnishing: 'Semi-Furnished',
    amenities: ['WiFi', 'Parking', 'Security'],
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
    ],
    videoTourUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    if (isEditing) {
      const fetchProperty = async () => {
        try {
          setLoading(true);
          const res = await propertiesAPI.getById(id);
          if (res.data.success) {
            const p = res.data.property;
            setFormData({
              title: p.title || '',
              description: p.description || '',
              propertyType: p.propertyType || 'Apartment',
              price: p.price || '',
              securityDeposit: p.securityDeposit || '',
              address: p.address || '',
              city: p.city || 'Bangalore',
              state: p.state || 'Karnataka',
              pincode: p.pincode || '',
              bedrooms: p.bedrooms || 1,
              bathrooms: p.bathrooms || 1,
              areaSqFt: p.areaSqFt || 800,
              furnishing: p.furnishing || 'Semi-Furnished',
              amenities: p.amenities || [],
              images: p.images && p.images.length > 0 ? p.images : [],
              videoTourUrl: p.videoTourUrl || '',
            });
          }
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to load property data');
        } finally {
          setLoading(false);
        }
      };
      fetchProperty();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const handleAddImage = (e) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newImageUrl.trim()],
    }));
    setNewImageUrl('');
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.price || !formData.address || !formData.city) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        price: Number(formData.price),
        securityDeposit: Number(formData.securityDeposit || formData.price * 2),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        areaSqFt: Number(formData.areaSqFt),
      };

      let res;
      if (isEditing) {
        res = await propertiesAPI.update(id, payload);
      } else {
        res = await propertiesAPI.create(payload);
      }

      if (res.data.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save property listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container" style={{ maxWidth: 880 }}>
        {/* Top Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <Link to="/dashboard" className="text-secondary small fw-semibold d-inline-flex align-items-center gap-1 mb-2">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <h1 className="fw-bold text-dark brand-font">
              {isEditing ? 'Edit Property Listing' : 'List a New Rental Property'}
            </h1>
            <p className="text-muted small">
              {user?.role === 'admin'
                ? 'Posting as Platform Admin (Listing will be published immediately).'
                : 'Posting as Property Owner (Listing will be submitted for Admin moderation).'}
            </p>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-3 rounded-3 mb-4">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Section 1: Basic Information */}
          <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <Building size={20} className="text-primary" /> Basic Information
            </h5>

            <div className="row g-3">
              <div className="col-12">
                <label className="form-label small fw-semibold text-dark">
                  Property Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className="form-control form-control-modern"
                  placeholder="e.g. Spacious 3BHK Penthouse with Private Garden Terrace"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold text-dark">
                  Property Type <span className="text-danger">*</span>
                </label>
                <select
                  name="propertyType"
                  className="form-select form-control-modern"
                  value={formData.propertyType}
                  onChange={handleChange}
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Independent House">Independent House</option>
                  <option value="Studio">Studio Loft</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold text-dark">
                  Furnishing Status
                </label>
                <select
                  name="furnishing"
                  className="form-select form-control-modern"
                  value={formData.furnishing}
                  onChange={handleChange}
                >
                  <option value="Furnished">Fully Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label small fw-semibold text-dark">
                  Detailed Description <span className="text-danger">*</span>
                </label>
                <textarea
                  name="description"
                  rows="4"
                  className="form-control form-control-modern"
                  placeholder="Describe property highlights, flooring, kitchen type, ventilation, surrounding neighborhood..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Specs */}
          <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <DollarSign size={20} className="text-success" /> Pricing & Specifications
            </h5>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold text-dark">
                  Monthly Rent (₹) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  min="1000"
                  step="500"
                  className="form-control form-control-modern"
                  placeholder="e.g. 45000"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold text-dark">
                  Security Deposit (₹)
                </label>
                <input
                  type="number"
                  name="securityDeposit"
                  min="0"
                  step="1000"
                  className="form-control form-control-modern"
                  placeholder="Defaults to 2x rent if blank"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-semibold text-dark">
                  Bedrooms (BHK) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  min="1"
                  max="12"
                  className="form-control form-control-modern"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-semibold text-dark">
                  Bathrooms <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  min="1"
                  max="10"
                  className="form-control form-control-modern"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-semibold text-dark">
                  Carpet Area (Sq Ft) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  name="areaSqFt"
                  min="100"
                  className="form-control form-control-modern"
                  placeholder="e.g. 1450"
                  value={formData.areaSqFt}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Location */}
          <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <MapPin size={20} className="text-danger" /> Location & Address
            </h5>

            <div className="row g-3">
              <div className="col-12">
                <label className="form-label small fw-semibold text-dark">
                  Street Address / Society Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  className="form-control form-control-modern"
                  placeholder="e.g. Flat 402, Sunrise Residency, 100ft Road, Indiranagar"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-semibold text-dark">
                  City <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  className="form-control form-control-modern"
                  placeholder="e.g. Bangalore"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-semibold text-dark">
                  State <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  className="form-control form-control-modern"
                  placeholder="e.g. Karnataka"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-semibold text-dark">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  className="form-control form-control-modern"
                  placeholder="e.g. 560038"
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Amenities */}
          <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <Layers size={20} className="text-warning" /> Amenities
            </h5>

            <div className="row g-2">
              {ALL_AMENITIES.map((amenity) => {
                const isSelected = formData.amenities.includes(amenity);
                return (
                  <div key={amenity} className="col-md-4 col-6">
                    <div
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`p-2 rounded-3 border d-flex align-items-center gap-2 cursor-pointer ${
                        isSelected ? 'bg-primary-subtle border-primary text-primary fw-semibold' : 'bg-light text-secondary'
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      <CheckCircle
                        size={16}
                        className={isSelected ? 'text-primary' : 'text-muted opacity-50'}
                      />
                      <span className="small">{amenity}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 5: Media & Virtual Tour */}
          <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <ImageIcon size={20} className="text-info" /> Photos & Virtual Tour
            </h5>

            {/* Existing Image previews */}
            <div className="row g-2 mb-3">
              {formData.images.map((img, idx) => (
                <div key={idx} className="col-md-4 col-6 position-relative">
                  <img
                    src={img}
                    alt={`Property photo ${idx + 1}`}
                    className="w-100 rounded-3 border"
                    style={{ height: 120, objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 p-1 rounded-circle"
                    title="Remove image"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Image URL Input */}
            <div className="input-group mb-3">
              <input
                type="url"
                className="form-control form-control-modern"
                placeholder="Paste public image URL (e.g. Unsplash or Cloudinary)..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="btn btn-outline-primary fw-semibold d-flex align-items-center gap-1"
              >
                <Plus size={16} /> Add Photo
              </button>
            </div>

            {/* Video Tour URL */}
            <div>
              <label className="form-label small fw-semibold text-dark d-flex align-items-center gap-1">
                <Video size={16} className="text-danger" /> YouTube Walkthrough / Virtual Tour Embed URL
              </label>
              <input
                type="url"
                name="videoTourUrl"
                className="form-control form-control-modern"
                placeholder="e.g. https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
                value={formData.videoTourUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="d-flex justify-content-end gap-3 pt-2 mb-5">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-househunt-secondary px-4"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-househunt-primary px-5 py-2 fw-bold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Saving Listing...
                </>
              ) : isEditing ? (
                'Update Property'
              ) : (
                'Publish Property Listing'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditPropertyPage;
