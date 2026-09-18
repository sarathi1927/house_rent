import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-4 mt-auto border-top border-secondary">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Home size={20} />
              </div>
              <span className="brand-font fs-4 fw-bold text-white">
                House<span style={{ color: '#818cf8' }}>Hunt</span>
              </span>
            </div>
            <p className="text-secondary small pe-lg-4">
              HouseHunt is the premier modern house rental marketplace connecting verified tenants with premier property owners. Simplify real estate transactions with virtual tours, transparent pricing, and instant booking workflows.
            </p>
            <div className="text-muted small">
              Built with MERN Stack (MongoDB, Express, React, Node.js).
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-white fw-bold mb-3">Discover</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-secondary">
              <li><Link to="/" className="text-decoration-none text-secondary hover-white">Home</Link></li>
              <li><Link to="/properties" className="text-decoration-none text-secondary hover-white">All Properties</Link></li>
              <li><Link to="/properties?propertyType=Apartment" className="text-decoration-none text-secondary hover-white">Apartments</Link></li>
              <li><Link to="/properties?propertyType=Villa" className="text-decoration-none text-secondary hover-white">Luxury Villas</Link></li>
              <li><Link to="/properties?propertyType=Studio" className="text-decoration-none text-secondary hover-white">Studio Lofts</Link></li>
            </ul>
          </div>

          {/* Cities */}
          <div className="col-lg-3 col-md-6 col-6">
            <h6 className="text-white fw-bold mb-3">Top Cities</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-secondary">
              <li><Link to="/properties?city=Bangalore" className="text-decoration-none text-secondary hover-white">Rent in Bangalore</Link></li>
              <li><Link to="/properties?city=Mumbai" className="text-decoration-none text-secondary hover-white">Rent in Mumbai</Link></li>
              <li><Link to="/properties?city=Hyderabad" className="text-decoration-none text-secondary hover-white">Rent in Hyderabad</Link></li>
              <li><Link to="/properties?city=Gurugram" className="text-decoration-none text-secondary hover-white">Rent in Delhi NCR / Gurugram</Link></li>
              <li><Link to="/properties?city=Pune" className="text-decoration-none text-secondary hover-white">Rent in Pune</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Reach Us</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-secondary">
              <li className="d-flex align-items-center gap-2">
                <MapPin size={16} className="text-primary" />
                <span>Indiranagar Tech Hub, Bangalore, India</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Mail size={16} className="text-primary" />
                <span>support@househunt.com</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Phone size={16} className="text-primary" />
                <span>+91 (080) 4567-8900</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 text-secondary small">
          <div>
            &copy; {new Date().getFullYear()} HouseHunt Systems Inc. All rights reserved.
          </div>
          <div className="d-flex align-items-center gap-1">
            Made with <Heart size={14} className="text-danger fill-danger" /> for Real Estate Renters & Landlords.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
