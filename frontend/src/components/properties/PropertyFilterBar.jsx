import React from 'react';
import { Search, MapPin, Building, RotateCcw, SlidersHorizontal } from 'lucide-react';

const CITIES = ['All', 'Bangalore', 'Mumbai', 'Hyderabad', 'Gurugram', 'Pune', 'Chennai'];
const TYPES = ['All', 'Apartment', 'Villa', 'Independent House', 'Studio', 'Penthouse'];
const BEDROOMS = ['All', '1', '2', '3', '4+'];
const FURNISHING = ['All', 'Furnished', 'Semi-Furnished', 'Unfurnished'];

const PropertyFilterBar = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
      {/* Top Search Bar */}
      <div className="row g-3 align-items-center mb-3">
        <div className="col-lg-6 col-md-12">
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <Search size={18} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control form-control-modern border-start-0"
              placeholder="Search by neighborhood, title, landmark, or description..."
              value={filters.keyword || ''}
              onChange={(e) => onFilterChange('keyword', e.target.value)}
            />
          </div>
        </div>

        {/* City */}
        <div className="col-lg-3 col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <MapPin size={18} className="text-danger" />
            </span>
            <select
              className="form-select form-control-modern border-start-0"
              value={filters.city || 'All'}
              onChange={(e) => onFilterChange('city', e.target.value === 'All' ? '' : e.target.value)}
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Locations / Cities' : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Property Type */}
        <div className="col-lg-3 col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <Building size={18} className="text-primary" />
            </span>
            <select
              className="form-select form-control-modern border-start-0"
              value={filters.propertyType || 'All'}
              onChange={(e) =>
                onFilterChange('propertyType', e.target.value === 'All' ? '' : e.target.value)
              }
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All Property Types' : t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Secondary Row: Bedrooms, Price, Furnishing, Sort, and Reset */}
      <div className="row g-3 align-items-end pt-2 border-top">
        {/* Bedrooms */}
        <div className="col-lg-2 col-md-4 col-6">
          <label className="form-label small fw-semibold text-secondary mb-1">Bedrooms</label>
          <select
            className="form-select form-select-sm"
            value={filters.bedrooms || 'All'}
            onChange={(e) =>
              onFilterChange('bedrooms', e.target.value === 'All' ? '' : e.target.value)
            }
          >
            {BEDROOMS.map((b) => (
              <option key={b} value={b}>
                {b === 'All' ? 'Any BHK' : `${b} BHK`}
              </option>
            ))}
          </select>
        </div>

        {/* Furnishing */}
        <div className="col-lg-2 col-md-4 col-6">
          <label className="form-label small fw-semibold text-secondary mb-1">Furnishing</label>
          <select
            className="form-select form-select-sm"
            value={filters.furnishing || 'All'}
            onChange={(e) =>
              onFilterChange('furnishing', e.target.value === 'All' ? '' : e.target.value)
            }
          >
            {FURNISHING.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* Max Price */}
        <div className="col-lg-3 col-md-4 col-12">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <label className="form-label small fw-semibold text-secondary mb-0">Max Budget</label>
            <span className="badge bg-primary-subtle text-primary fw-bold small">
              {filters.maxPrice ? `₹${Number(filters.maxPrice).toLocaleString('en-IN')}/mo` : 'No Limit'}
            </span>
          </div>
          <input
            type="range"
            className="form-range"
            min="10000"
            max="200000"
            step="5000"
            value={filters.maxPrice || 200000}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
          />
        </div>

        {/* Sort */}
        <div className="col-lg-3 col-md-6 col-8">
          <label className="form-label small fw-semibold text-secondary mb-1">Sort Results</label>
          <select
            className="form-select form-select-sm"
            value={filters.sortBy || 'newest'}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
          >
            <option value="newest">Newest Listed First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="area">Largest Area (Sq Ft)</option>
          </select>
        </div>

        {/* Reset */}
        <div className="col-lg-2 col-md-6 col-4 d-grid">
          <button
            onClick={onReset}
            className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center gap-1"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilterBar;
