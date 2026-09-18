import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  propertiesAPI,
  bookingsAPI,
  statsAPI,
} from '../services/api';
import PropertyCard from '../components/properties/PropertyCard';
import {
  LayoutDashboard,
  Building,
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Users,
  DollarSign,
  MapPin,
  TrendingUp,
  AlertCircle,
  ShieldAlert,
  Eye,
  Check,
  X,
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Stats
  const [platformStats, setPlatformStats] = useState(null);
  const [ownerStats, setOwnerStats] = useState(null);

  // Data lists
  const [myProperties, setMyProperties] = useState([]);
  const [pendingProperties, setPendingProperties] = useState([]);
  const [tenantBookings, setTenantBookings] = useState([]);
  const [ownerBookings, setOwnerBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  const fetchData = async () => {
    try {
      setLoading(true);

      if (user?.role === 'admin') {
        const [statsRes, pendingRes, propsRes] = await Promise.allSettled([
          statsAPI.getPlatformStats(),
          propertiesAPI.getAdminPending(),
          propertiesAPI.getAll({ limit: 50, includePending: 'true' }),
        ]);

        if (statsRes.status === 'fulfilled') setPlatformStats(statsRes.value.data.stats);
        if (pendingRes.status === 'fulfilled') setPendingProperties(pendingRes.value.data.properties);
        if (propsRes.status === 'fulfilled') setMyProperties(propsRes.value.data.properties);
      } else if (user?.role === 'owner') {
        const [ownerStatsRes, myPropsRes, requestsRes] = await Promise.allSettled([
          statsAPI.getOwnerStats(),
          propertiesAPI.getMyProperties(),
          bookingsAPI.getOwnerRequests(),
        ]);

        if (ownerStatsRes.status === 'fulfilled') setOwnerStats(ownerStatsRes.value.data.stats);
        if (myPropsRes.status === 'fulfilled') setMyProperties(myPropsRes.value.data.properties);
        if (requestsRes.status === 'fulfilled') setOwnerBookings(requestsRes.value.data.bookings);
      } else {
        // Tenant
        const bookingsRes = await bookingsAPI.getMyBookings();
        if (bookingsRes.data.success) {
          setTenantBookings(bookingsRes.data.bookings);
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Admin approves / rejects property listing
  const handlePropertyStatusChange = async (propertyId, status) => {
    try {
      const res = await propertiesAPI.updateStatus(propertyId, { status });
      if (res.data.success) {
        setActionMessage({
          type: 'success',
          text: `Property marked as ${status.toUpperCase()} successfully!`,
        });
        // Refresh lists
        setPendingProperties((prev) => prev.filter((p) => p._id !== propertyId));
        setMyProperties((prev) =>
          prev.map((p) => (p._id === propertyId ? { ...p, status } : p))
        );
      }
    } catch (err) {
      setActionMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to update property status',
      });
    }
  };

  // Landlord approves / rejects tenant booking request
  const handleBookingStatusChange = async (bookingId, status) => {
    try {
      const res = await bookingsAPI.updateStatus(bookingId, { status });
      if (res.data.success) {
        setActionMessage({
          type: 'success',
          text: `Booking request updated to ${status.toUpperCase()}!`,
        });
        setOwnerBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status } : b))
        );
      }
    } catch (err) {
      setActionMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to update booking status',
      });
    }
  };

  // Tenant cancels booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking request?')) return;
    try {
      const res = await bookingsAPI.cancel(bookingId);
      if (res.data.success) {
        setActionMessage({
          type: 'info',
          text: 'Booking request cancelled.',
        });
        setTenantBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' } : b))
        );
      }
    } catch (err) {
      setActionMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to cancel booking',
      });
    }
  };

  // Delete property
  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to permanently delete this property listing?')) return;
    try {
      const res = await propertiesAPI.delete(propertyId);
      if (res.data.success) {
        setActionMessage({ type: 'success', text: 'Property listing deleted.' });
        setMyProperties((prev) => prev.filter((p) => p._id !== propertyId));
        setPendingProperties((prev) => prev.filter((p) => p._id !== propertyId));
      }
    } catch (err) {
      setActionMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to delete property',
      });
    }
  };

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Welcome Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-2 border-bottom">
          <div>
            <h1 className="fw-bold text-dark brand-font mb-1">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted mb-0">
              Role:{' '}
              <span className="badge bg-primary text-uppercase px-2 py-1 ms-1">
                {user?.role === 'owner' ? 'Landlord / Property Owner' : user?.role}
              </span>
            </p>
          </div>

          {(user?.role === 'owner' || user?.role === 'admin') && (
            <div className="mt-3 mt-md-0">
              <Link to="/properties/new" className="btn btn-househunt-primary">
                <PlusCircle size={18} /> List New Property
              </Link>
            </div>
          )}
        </div>

        {/* Global Feedback Alert */}
        {actionMessage.text && (
          <div
            className={`alert alert-${actionMessage.type} alert-dismissible fade show rounded-3 mb-4`}
            role="alert"
          >
            {actionMessage.text}
            <button
              type="button"
              className="btn-close"
              onClick={() => setActionMessage({ type: '', text: '' })}
            ></button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ROLE 1: ADMIN DASHBOARD VIEW                                              */}
        {/* ========================================================================= */}
        {user?.role === 'admin' && (
          <>
            {/* KPI Metric Cards */}
            <div className="row g-4 mb-5">
              <div className="col-md-3 col-6">
                <div className="p-4 bg-white rounded-4 shadow-sm border h-100">
                  <div className="text-muted small fw-semibold mb-1">Total Properties</div>
                  <div className="display-6 fw-bold text-dark brand-font">
                    {platformStats?.totalProperties || 0}
                  </div>
                  <div className="text-success small fw-semibold mt-2">
                    {platformStats?.approvedProperties || 0} approved & live
                  </div>
                </div>
              </div>

              <div className="col-md-3 col-6">
                <div className="p-4 bg-white rounded-4 shadow-sm border h-100 border-warning border-opacity-50">
                  <div className="text-muted small fw-semibold mb-1">Awaiting Approval</div>
                  <div className="display-6 fw-bold text-warning brand-font">
                    {pendingProperties.length}
                  </div>
                  <div className="text-muted small mt-2">Requires moderator review</div>
                </div>
              </div>

              <div className="col-md-3 col-6">
                <div className="p-4 bg-white rounded-4 shadow-sm border h-100">
                  <div className="text-muted small fw-semibold mb-1">Total Users</div>
                  <div className="display-6 fw-bold text-primary brand-font">
                    {platformStats?.totalUsers || 0}
                  </div>
                  <div className="text-muted small mt-2">Landlords & Renters</div>
                </div>
              </div>

              <div className="col-md-3 col-6">
                <div className="p-4 bg-white rounded-4 shadow-sm border h-100">
                  <div className="text-muted small fw-semibold mb-1">Total Bookings</div>
                  <div className="display-6 fw-bold text-info brand-font">
                    {platformStats?.totalBookings || 0}
                  </div>
                  <div className="text-success small fw-semibold mt-2">
                    {platformStats?.confirmedBookings || 0} confirmed agreements
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Tabs */}
            <ul className="nav nav-pills mb-4 bg-white p-2 rounded-3 border shadow-sm">
              <li className="nav-item">
                <button
                  className={`nav-link fw-semibold d-flex align-items-center gap-2 ${
                    activeTab === 'overview' ? 'active bg-primary' : 'text-secondary'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  <ShieldAlert size={16} />
                  Pending Approvals ({pendingProperties.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link fw-semibold d-flex align-items-center gap-2 ${
                    activeTab === 'all' ? 'active bg-primary' : 'text-secondary'
                  }`}
                  onClick={() => setActiveTab('all')}
                >
                  <Building size={16} />
                  All Platform Listings ({myProperties.length})
                </button>
              </li>
            </ul>

            {/* Tab 1: Pending Approvals Table */}
            {activeTab === 'overview' && (
              <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
                <h4 className="fw-bold text-dark brand-font mb-3">
                  Listings Pending Moderator Review
                </h4>
                {pendingProperties.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <CheckCircle2 size={40} className="text-success mb-2" />
                    <h6>All clear! No listings are currently pending approval.</h6>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Property</th>
                          <th>Owner</th>
                          <th>Rent</th>
                          <th>Location</th>
                          <th>Submitted Date</th>
                          <th className="text-end">Moderation Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingProperties.map((p) => (
                          <tr key={p._id}>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <img
                                  src={p.images[0]}
                                  alt={p.title}
                                  className="rounded-3 border"
                                  style={{ width: 60, height: 45, objectFit: 'cover' }}
                                />
                                <div>
                                  <Link
                                    to={`/properties/${p._id}`}
                                    className="fw-bold text-dark text-decoration-none hover-primary"
                                  >
                                    {p.title}
                                  </Link>
                                  <div className="text-muted small">{p.propertyType} • {p.bedrooms} BHK</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="fw-semibold small text-dark">{p.owner?.name}</div>
                              <div className="text-muted small">{p.owner?.email}</div>
                            </td>
                            <td className="fw-bold text-primary">{formatPrice(p.price)}/mo</td>
                            <td className="small text-secondary">{p.city}</td>
                            <td className="small text-muted">
                              {new Date(p.createdAt).toLocaleDateString()}
                            </td>
                            <td className="text-end">
                              <div className="d-inline-flex gap-2">
                                <button
                                  onClick={() => handlePropertyStatusChange(p._id, 'approved')}
                                  className="btn btn-sm btn-success fw-semibold d-flex align-items-center gap-1"
                                >
                                  <Check size={14} /> Approve
                                </button>
                                <button
                                  onClick={() => handlePropertyStatusChange(p._id, 'rejected')}
                                  className="btn btn-sm btn-outline-danger fw-semibold d-flex align-items-center gap-1"
                                >
                                  <X size={14} /> Reject
                                </button>
                                <Link
                                  to={`/properties/${p._id}`}
                                  className="btn btn-sm btn-light border"
                                  title="Inspect Details"
                                >
                                  <Eye size={14} />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: All Listings */}
            {activeTab === 'all' && (
              <div className="row g-4">
                {myProperties.map((property) => (
                  <div key={property._id} className="col-lg-4 col-md-6">
                    <PropertyCard
                      property={property}
                      showAdminControls={true}
                      onStatusChange={handlePropertyStatusChange}
                      onDelete={handleDeleteProperty}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ========================================================================= */}
        {/* ROLE 2: LANDLORD / OWNER DASHBOARD VIEW                                   */}
        {/* ========================================================================= */}
        {user?.role === 'owner' && (
          <>
            {/* Owner Stats */}
            <div className="row g-4 mb-5">
              <div className="col-md-3 col-6">
                <div className="p-4 bg-white rounded-4 shadow-sm border h-100">
                  <div className="text-muted small fw-semibold mb-1">My Total Listings</div>
                  <div className="display-6 fw-bold text-dark brand-font">
                    {ownerStats?.myPropertiesCount || myProperties.length}
                  </div>
                  <div className="text-success small fw-semibold mt-2">
                    {ownerStats?.myApprovedCount || 0} published & live
                  </div>
                </div>
              </div>

              <div className="col-md-3 col-6">
                <div className="p-4 bg-white rounded-4 shadow-sm border h-100 border-primary border-opacity-50">
                  <div className="text-muted small fw-semibold mb-1">Pending Inquiries</div>
                  <div className="display-6 fw-bold text-primary brand-font">
                    {ownerBookings.filter((b) => b.status === 'pending').length}
                  </div>
                  <div className="text-muted small mt-2">Tenants requesting move-in</div>
                </div>
              </div>

              <div className="col-md-3 col-6">
                <div className="p-4 bg-white rounded-4 shadow-sm border h-100">
                  <div className="text-muted small fw-semibold mb-1">Confirmed Rentals</div>
                  <div className="display-6 fw-bold text-success brand-font">
                    {ownerBookings.filter((b) => b.status === 'confirmed').length}
                  </div>
                  <div className="text-muted small mt-2">Active leases</div>
                </div>
              </div>

              <div className="col-md-3 col-6">
                <div className="p-4 bg-white rounded-4 shadow-sm border h-100">
                  <div className="text-muted small fw-semibold mb-1">Est. Monthly Revenue</div>
                  <div className="fs-3 fw-bold text-dark brand-font">
                    {formatPrice(ownerStats?.monthlyRentalRevenue || 0)}
                  </div>
                  <div className="text-success small fw-semibold mt-2">From confirmed tenants</div>
                </div>
              </div>
            </div>

            {/* Owner Navigation Tabs */}
            <ul className="nav nav-pills mb-4 bg-white p-2 rounded-3 border shadow-sm">
              <li className="nav-item">
                <button
                  className={`nav-link fw-semibold d-flex align-items-center gap-2 ${
                    activeTab === 'overview' ? 'active bg-primary' : 'text-secondary'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  <CalendarCheck size={16} />
                  Booking Requests ({ownerBookings.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link fw-semibold d-flex align-items-center gap-2 ${
                    activeTab === 'properties' ? 'active bg-primary' : 'text-secondary'
                  }`}
                  onClick={() => setActiveTab('properties')}
                >
                  <Building size={16} />
                  My Properties ({myProperties.length})
                </button>
              </li>
            </ul>

            {/* Tab 1: Incoming Booking Requests */}
            {activeTab === 'overview' && (
              <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
                <h4 className="fw-bold text-dark brand-font mb-3">Incoming Tenant Requests</h4>
                {ownerBookings.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <CalendarCheck size={40} className="text-muted mb-2" />
                    <h6>No booking requests received yet.</h6>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Applicant / Tenant</th>
                          <th>Property</th>
                          <th>Move-in Date</th>
                          <th>Duration</th>
                          <th>Monthly Rent</th>
                          <th>Status</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ownerBookings.map((b) => (
                          <tr key={b._id}>
                            <td>
                              <div className="fw-bold text-dark">{b.tenant?.name}</div>
                              <div className="text-muted small">{b.tenant?.email}</div>
                              {b.tenantMessage && (
                                <div className="text-secondary small fst-italic mt-1">
                                  "{b.tenantMessage}"
                                </div>
                              )}
                            </td>
                            <td>
                              <Link
                                to={`/properties/${b.property?._id}`}
                                className="fw-semibold text-dark text-decoration-none hover-primary"
                              >
                                {b.property?.title}
                              </Link>
                              <div className="text-muted small">{b.property?.city}</div>
                            </td>
                            <td className="small text-secondary">
                              {new Date(b.moveInDate).toLocaleDateString()}
                            </td>
                            <td className="small text-secondary">{b.durationMonths} Months</td>
                            <td className="fw-bold text-primary">{formatPrice(b.monthlyRent)}</td>
                            <td>
                              <span
                                className={`badge-pill-modern ${
                                  b.status === 'confirmed'
                                    ? 'badge-approved'
                                    : b.status === 'pending'
                                    ? 'badge-pending'
                                    : 'badge-rejected'
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                            <td className="text-end">
                              {b.status === 'pending' ? (
                                <div className="d-inline-flex gap-2">
                                  <button
                                    onClick={() => handleBookingStatusChange(b._id, 'confirmed')}
                                    className="btn btn-sm btn-success fw-semibold"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleBookingStatusChange(b._id, 'rejected')}
                                    className="btn btn-sm btn-outline-danger fw-semibold"
                                  >
                                    Decline
                                  </button>
                                </div>
                              ) : (
                                <span className="text-muted small">Processed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: My Properties List */}
            {activeTab === 'properties' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="fw-bold text-dark brand-font mb-0">My Rental Properties</h4>
                  <Link to="/properties/new" className="btn btn-sm btn-househunt-primary">
                    <PlusCircle size={15} /> Add New Listing
                  </Link>
                </div>
                <div className="row g-4">
                  {myProperties.map((prop) => (
                    <div key={prop._id} className="col-lg-4 col-md-6">
                      <PropertyCard
                        property={prop}
                        showAdminControls={true}
                        onDelete={handleDeleteProperty}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ========================================================================= */}
        {/* ROLE 3: TENANT / RENTER DASHBOARD VIEW                                    */}
        {/* ========================================================================= */}
        {user?.role === 'tenant' && (
          <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
              <div>
                <h4 className="fw-bold text-dark brand-font mb-1">My Rental Bookings & Inquiries</h4>
                <p className="text-muted small mb-0">Track confirmation and move-in status from landlords.</p>
              </div>
              <Link to="/properties" className="btn btn-househunt-primary">
                Explore More Homes
              </Link>
            </div>

            {tenantBookings.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <Building size={48} className="text-secondary opacity-50 mb-3" />
                <h5 className="fw-bold text-dark">No Active Rental Bookings Yet</h5>
                <p className="text-muted mb-4">
                  Start browsing houses and luxury apartments to submit your first move-in reservation request.
                </p>
                <Link to="/properties" className="btn btn-househunt-primary">
                  Browse Properties
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Property</th>
                      <th>Landlord / Host</th>
                      <th>Scheduled Move-in</th>
                      <th>Lease Term</th>
                      <th>Rent & Deposit</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenantBookings.map((b) => (
                      <tr key={b._id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={b.property?.images?.[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=100&q=80'}
                              alt={b.property?.title}
                              className="rounded-3 border"
                              style={{ width: 64, height: 48, objectFit: 'cover' }}
                            />
                            <div>
                              <Link
                                to={`/properties/${b.property?._id}`}
                                className="fw-bold text-dark text-decoration-none hover-primary"
                              >
                                {b.property?.title}
                              </Link>
                              <div className="text-muted small">{b.property?.city}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="fw-semibold text-dark small">{b.owner?.name}</div>
                          <div className="text-muted small">{b.owner?.phone || b.owner?.email}</div>
                        </td>
                        <td className="small text-secondary">
                          {new Date(b.moveInDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="small text-secondary">{b.durationMonths} Months</td>
                        <td>
                          <div className="fw-bold text-primary">{formatPrice(b.monthlyRent)}/mo</div>
                          <div className="text-muted small">
                            Deposit: {formatPrice(b.totalDeposit)}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge-pill-modern ${
                              b.status === 'confirmed'
                                ? 'badge-approved'
                                : b.status === 'pending'
                                ? 'badge-pending'
                                : 'badge-rejected'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="text-end">
                          {b.status === 'pending' && (
                            <button
                              onClick={() => handleCancelBooking(b._id)}
                              className="btn btn-sm btn-outline-danger"
                            >
                              Cancel Request
                            </button>
                          )}
                          {b.status === 'confirmed' && (
                            <span className="badge bg-success-subtle text-success py-1 px-2 fw-semibold">
                              Booking Confirmed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
