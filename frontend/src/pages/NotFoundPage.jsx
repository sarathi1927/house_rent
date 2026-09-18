import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="py-5 bg-light min-vh-75 d-flex align-items-center justify-content-center text-center">
      <div className="container" style={{ maxWidth: 500 }}>
        <Compass size={64} className="text-primary mb-3" />
        <h1 className="display-4 fw-bold text-dark brand-font">404</h1>
        <h4 className="fw-bold text-dark mb-2">Page Not Found</h4>
        <p className="text-muted mb-4">
          Oops! The page you're looking for doesn't exist, may have moved, or the link might be broken.
        </p>
        <Link to="/" className="btn btn-househunt-primary">
          <Home size={16} /> Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
