import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { propertiesAPI } from '../services/api';
import PropertyCard from '../components/properties/PropertyCard';
import PropertyFilterBar from '../components/properties/PropertyFilterBar';
import { Home, Frown, RotateCcw } from 'lucide-react';

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    city: searchParams.get('city') || '',
    propertyType: searchParams.get('propertyType') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    furnishing: searchParams.get('furnishing') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
  });

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 9,
        sortBy: filters.sortBy,
      };

      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.city) params.city = filters.city;
      if (filters.propertyType) params.propertyType = filters.propertyType;
      if (filters.bedrooms && filters.bedrooms !== 'All') params.bedrooms = filters.bedrooms;
      if (filters.furnishing && filters.furnishing !== 'All') params.furnishing = filters.furnishing;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const res = await propertiesAPI.getAll(params);
      if (res.data.success) {
        setProperties(res.data.properties);
        setTotalCount(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Failed to load properties:', err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when filters or page changes
  useEffect(() => {
    fetchProperties();
  }, [filters, currentPage]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const updated = { ...prev, [key]: value };
      // Sync URL params
      const newParams = new URLSearchParams();
      Object.entries(updated).forEach(([k, v]) => {
        if (v) newParams.set(k, v);
      });
      setSearchParams(newParams);
      return updated;
    });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      keyword: '',
      city: '',
      propertyType: '',
      bedrooms: '',
      furnishing: '',
      maxPrice: '',
      sortBy: 'newest',
    };
    setFilters(defaultFilters);
    setSearchParams(new URLSearchParams());
    setCurrentPage(1);
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="mb-4">
          <h1 className="fw-bold text-dark brand-font mb-1">
            Explore Rental Properties
          </h1>
          <p className="text-muted">
            Search from verified houses, villas, and apartments ready for immediate move-in.
          </p>
        </div>

        {/* Filter Bar */}
        <PropertyFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Results Summary */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="text-secondary small fw-semibold">
            {loading ? (
              'Searching verified homes...'
            ) : (
              <>
                Found <span className="text-primary fw-bold">{totalCount}</span> available properties
                {filters.city ? ` in ${filters.city}` : ''}
              </>
            )}
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading properties...</span>
            </div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 border p-5 shadow-sm">
            <Frown size={50} className="text-muted mb-3" />
            <h4 className="fw-bold text-dark">No Properties Found</h4>
            <p className="text-muted mb-4">
              We couldn't find any rentals matching your specific filters. Try relaxing the budget or selecting another city.
            </p>
            <button onClick={handleResetFilters} className="btn btn-househunt-primary">
              <RotateCcw size={16} /> Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="row g-4 mb-5">
              {properties.map((property) => (
                <div key={property._id} className="col-lg-4 col-md-6">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center">
                <nav aria-label="Properties pagination">
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      >
                        Previous
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <li
                        key={page}
                        className={`page-item ${currentPage === page ? 'active' : ''}`}
                      >
                        <button className="page-link" onClick={() => setCurrentPage(page)}>
                          {page}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PropertiesPage;
