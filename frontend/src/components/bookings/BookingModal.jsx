import React, { useState } from 'react';
import { bookingsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, CreditCard, Send, CheckCircle2, AlertCircle, X } from 'lucide-react';

const BookingModal = ({ property, isOpen, onClose, onSuccess }) => {
  const { isAuthenticated, user } = useAuth();
  const [moveInDate, setMoveInDate] = useState('');
  const [durationMonths, setDurationMonths] = useState(11);
  const [tenantMessage, setTenantMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !property) return null;

  const deposit = property.securityDeposit || property.price * 2;
  const upfrontTotal = property.price + deposit;

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      setError('You must be logged in to request a rental booking.');
      return;
    }

    if (!moveInDate) {
      setError('Please pick an intended move-in date.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await bookingsAPI.create({
        propertyId: property._id,
        moveInDate,
        durationMonths: Number(durationMonths),
        tenantMessage,
      });

      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          if (onSuccess) onSuccess(res.data.booking);
          onClose();
        }, 2200);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rental booking request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-light border-bottom px-4 py-3">
            <div>
              <h5 className="modal-title fw-bold text-dark brand-font mb-0">
                Book Rental / Schedule Move-in
              </h5>
              <p className="text-muted small mb-0">{property.title}</p>
            </div>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>

          <div className="modal-body p-4">
            {success ? (
              <div className="text-center py-5">
                <CheckCircle2 size={56} className="text-success mb-3 animate-bounce" />
                <h4 className="fw-bold text-dark">Rental Request Sent!</h4>
                <p className="text-muted mb-4 px-md-5">
                  Your rental inquiry and reservation request has been transmitted directly to landlord{' '}
                  <strong>{property.owner?.name || 'the property owner'}</strong>. You can track status in your Dashboard.
                </p>
                <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                <span className="ms-2 text-muted small">Redirecting to booking summary...</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 small rounded-3 mb-3">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="row g-3">
                  {/* Move In Date */}
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">
                      Intended Move-in Date <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <Calendar size={16} className="text-muted" />
                      </span>
                      <input
                        type="date"
                        className="form-control form-control-modern"
                        min={new Date().toISOString().split('T')[0]}
                        value={moveInDate}
                        onChange={(e) => setMoveInDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Rental Duration */}
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">
                      Lease Duration (Months)
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <Clock size={16} className="text-muted" />
                      </span>
                      <select
                        className="form-select form-control-modern"
                        value={durationMonths}
                        onChange={(e) => setDurationMonths(e.target.value)}
                      >
                        <option value="6">6 Months</option>
                        <option value="11">11 Months (Standard Agreement)</option>
                        <option value="12">12 Months (1 Year)</option>
                        <option value="24">24 Months (2 Years)</option>
                        <option value="36">36 Months (3 Years)</option>
                      </select>
                    </div>
                  </div>

                  {/* Personal Message */}
                  <div className="col-12">
                    <label className="form-label small fw-semibold text-dark">
                      Message for Landlord (Optional)
                    </label>
                    <textarea
                      rows="3"
                      className="form-control form-control-modern"
                      placeholder="Introduce yourself, occupation, family/pets, or ask any move-in questions..."
                      value={tenantMessage}
                      onChange={(e) => setTenantMessage(e.target.value)}
                    ></textarea>
                  </div>

                  {/* Financial Breakdown Card */}
                  <div className="col-12">
                    <div className="p-3 bg-light rounded-3 border">
                      <h6 className="fw-bold text-dark mb-2 small text-uppercase">Payment Estimation Breakdown</h6>
                      <div className="d-flex justify-content-between small text-secondary mb-1">
                        <span>First Month Rent:</span>
                        <span className="fw-semibold text-dark">{formatPrice(property.price)}</span>
                      </div>
                      <div className="d-flex justify-content-between small text-secondary mb-1">
                        <span>Refundable Security Deposit:</span>
                        <span className="fw-semibold text-dark">{formatPrice(deposit)}</span>
                      </div>
                      <div className="d-flex justify-content-between small text-secondary mb-2">
                        <span>Brokerage / Application Fee:</span>
                        <span className="text-success fw-bold">₹0 (Direct from Owner)</span>
                      </div>
                      <hr className="my-2" />
                      <div className="d-flex justify-content-between fw-bold text-dark">
                        <span>Total Estimated Initial Payable:</span>
                        <span className="text-primary fs-5">{formatPrice(upfrontTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="d-flex justify-content-end gap-2 mt-4 pt-2 border-top">
                  <button
                    type="button"
                    className="btn btn-househunt-secondary"
                    onClick={onClose}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-househunt-primary px-4"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={16} /> Submit Booking Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
