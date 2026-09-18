import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { propertiesAPI, statsAPI } from '../services/api';
import PropertyCard from '../components/properties/PropertyCard';
import {
  Search,
  MapPin,
  Building,
  ShieldCheck,
  Video,
  Key,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [platformStats, setPlatformStats] = useState({
    approvedProperties: 8,
    totalUsers: 15,
    activeCities: 6,
    totalBookings: 12,
  });
  const [loading, setLoading] = useState(true);

  // Hero search form state
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propsRes, statsRes] = await Promise.allSettled([
          propertiesAPI.getAll({ limit: 6, sortBy: 'rating' }),
          statsAPI.getPlatformStats(),
        ]);

        if (propsRes.status === 'fulfilled' && propsRes.value.data.success) {
          setFeaturedProperties(propsRes.value.data.properties);
        }

        if (statsRes.status === 'fulfilled' && statsRes.value.data.success) {
          setPlatformStats(statsRes.value.data.stats);
        }
      } catch (err) {
        console.error('Error fetching home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity) params.append('city', searchCity);
    if (searchType) params.append('propertyType', searchType);
    if (searchKeyword) params.append('keyword', searchKeyword);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow"></div>
        <div className="container position-relative py-lg-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white bg-opacity-10 border border-white border-opacity-20 mb-3">
                <Sparkles size={16} className="text-warning" />
                <span className="small fw-semibold text-light">
                  Next-Gen House Rental Marketplace
                </span>
              </div>
              <h1 className="hero-title mb-3">
                Find Your Ideal Rental Home with <span className="hero-highlight">Total Clarity</span>
              </h1>
              <p className="lead text-light text-opacity-75 mb-4 pe-lg-4">
                Discover verified apartments, modern villas, and cozy studios. Zero hidden brokerages, interactive virtual tours, and instant digital booking directly with property owners.
              </p>

              {/* Hero Search Box */}
              <div className="hero-search-box text-dark mt-2">
                <form onSubmit={handleHeroSearch}>
                  <div className="row g-2 align-items-center">
                    <div className="col-md-4 col-12">
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0">
                          <MapPin size={18} className="text-danger" />
                        </span>
                        <select
                          className="form-select border-0 bg-light"
                          value={searchCity}
                          onChange={(e) => setSearchCity(e.target.value)}
                        >
                          <option value="">Any City</option>
                          <option value="Bangalore">Bangalore</option>
                          <option value="Mumbai">Mumbai</option>
                          <option value="Hyderabad">Hyderabad</option>
                          <option value="Gurugram">Gurugram / NCR</option>
                          <option value="Pune">Pune</option>
                          <option value="Chennai">Chennai</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-4 col-12">
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0">
                          <Building size={18} className="text-primary" />
                        </span>
                        <select
                          className="form-select border-0 bg-light"
                          value={searchType}
                          onChange={(e) => setSearchType(e.target.value)}
                        >
                          <option value="">All Types</option>
                          <option value="Apartment">Apartment</option>
                          <option value="Villa">Luxury Villa</option>
                          <option value="Studio">Studio Loft</option>
                          <option value="Penthouse">Penthouse</option>
                          <option value="Independent House">Independent House</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-4 col-12">
                      <button
                        type="submit"
                        className="btn btn-househunt-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                      >
                        <Search size={18} /> Search Homes
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="col-lg-5">
              <div className="row g-3">
                <div className="col-6">
                  <div className="stat-box">
                    <div className="stat-number">
                      {platformStats?.approvedProperties || 12}+
                    </div>
                    <div className="text-light text-opacity-75 small fw-semibold">
                      Verified Rental Homes
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="stat-box">
                    <div className="stat-number">
                      {platformStats?.activeCities || 6}
                    </div>
                    <div className="text-light text-opacity-75 small fw-semibold">
                      Major Metros Covered
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="stat-box">
                    <div className="stat-number">
                      {platformStats?.totalUsers || 24}+
                    </div>
                    <div className="text-light text-opacity-75 small fw-semibold">
                      Registered Users
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="stat-box">
                    <div className="stat-number">100%</div>
                    <div className="text-light text-opacity-75 small fw-semibold">
                      Direct Landlord Connect
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-5 bg-white">
        <div className="container py-lg-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="badge bg-primary-subtle text-primary fw-bold text-uppercase px-3 py-1 mb-2">
                Handpicked Listings
              </span>
              <h2 className="display-6 fw-bold text-dark">Featured Residences for Rent</h2>
              <p className="text-muted mb-0">
                Explore our top-rated residential rentals reviewed by verified tenants.
              </p>
            </div>
            <Link
              to="/properties"
              className="btn btn-outline-primary fw-semibold rounded-pill px-4 mt-3 mt-md-0 d-inline-flex align-items-center gap-2"
            >
              Browse All Properties <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading properties...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {featuredProperties.slice(0, 6).map((property) => (
                <div key={property._id} className="col-lg-4 col-md-6">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Key Benefits / Value Proposition */}
      <section className="py-5 bg-light border-top border-bottom">
        <div className="container py-lg-4">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="badge bg-success-subtle text-success fw-bold text-uppercase px-3 py-1 mb-2">
              Why HouseHunt
            </span>
            <h2 className="display-6 fw-bold text-dark">A Smarter Real Estate Experience</h2>
            <p className="text-muted">
              We eliminated obsolete paperwork, middleman commissions, and inaccurate listings.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 border text-center text-md-start">
                <div className="icon-circle mx-auto mx-md-0">
                  <ShieldCheck size={26} />
                </div>
                <h5 className="fw-bold text-dark mb-2">Verified Landlords</h5>
                <p className="text-muted small mb-0">
                  Every property undergoes strict moderation before going live to guarantee authentic listings and avoid scams.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 border text-center text-md-start">
                <div className="icon-circle mx-auto mx-md-0">
                  <Video size={26} />
                </div>
                <h5 className="fw-bold text-dark mb-2">Virtual Tours</h5>
                <p className="text-muted small mb-0">
                  Inspect every bedroom, balcony, and floor plan virtually from anywhere before scheduling physical walk-ins.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 border text-center text-md-start">
                <div className="icon-circle mx-auto mx-md-0">
                  <Key size={26} />
                </div>
                <h5 className="fw-bold text-dark mb-2">Instant Digital Booking</h5>
                <p className="text-muted small mb-0">
                  Send lease requests with customized move-in dates and transparent security deposit calculations.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 border text-center text-md-start">
                <div className="icon-circle mx-auto mx-md-0">
                  <Users size={26} />
                </div>
                <h5 className="fw-bold text-dark mb-2">Direct Communication</h5>
                <p className="text-muted small mb-0">
                  Chat and coordinate move-ins directly with owners with zero third-party agent markups.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Landlord CTA Banner */}
      <section className="py-5 bg-white">
        <div className="container">
          <div
            className="p-5 rounded-4 text-white position-relative overflow-hidden shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
            }}
          >
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <h3 className="display-6 fw-bold mb-3">Own a House or Luxury Apartment?</h3>
                <p className="text-light text-opacity-80 mb-4 pe-lg-5">
                  List your property on HouseHunt and connect with thousands of pre-screened, credit-ready tenants. Manage inquiries, screen bookings, and receive direct rental deposits.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Link to="/properties/new" className="btn btn-light fw-bold text-primary px-4 py-2 rounded-pill">
                    List Your Property for Free
                  </Link>
                  <Link to="/register" className="btn btn-outline-light fw-semibold px-4 py-2 rounded-pill">
                    Create Landlord Account
                  </Link>
                </div>
              </div>
              <div className="col-lg-4 text-center d-none d-lg-block">
                <div className="p-4 bg-white bg-opacity-10 rounded-4 border border-white border-opacity-20 backdrop-blur">
                  <div className="fs-1 fw-bold text-warning mb-1">0%</div>
                  <div className="fw-semibold">Listing Commission</div>
                  <hr className="border-white opacity-25 my-3" />
                  <div className="small text-light text-opacity-80">
                    Keep 100% of your rental income with direct tenant agreements.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
