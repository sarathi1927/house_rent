# HouseHunt - House Rental & Property Management System (MERN)

**HouseHunt** is a modern full-stack web application designed to revolutionize the real estate rental marketplace. Built using **MongoDB, Express.js, React.js, and Node.js (MERN)**, it offers a seamless, all-in-one platform connecting Tenants/Renters, Property Owners/Landlords, and Platform Administrators.

![HouseHunt Interface](C:/Users/LENOVO/.gemini/antigravity-ide/brain/d5f03b07-4f56-4226-979d-49767cb4d8cc/househunt_mockup_1789722552686.jpg)

---

## 🔗 Project Deliverables & Links

| Deliverable | Resource Link | Details |
|---|---|---|
| 📄 **Project Documentation** | [Google Drive Document Folder](https://drive.google.com/drive/folders/16U9R_6tr8m4g5V83rHw4mP5Q354kS5xl?usp=drive_link) | Project report, architecture & system documentation |
| 🎥 **Project Demo Video** | [Google Drive Video Folder](https://drive.google.com/drive/folders/1OJ9HhmjlHmJNF3zqCxKjB3lJgKmYYCOd?usp=drive_link) | Complete walkthrough and demonstration video |

---

## 🌟 Key Features

### 1. User Roles & Security
- **Role-Based Access Control (RBAC)**: Secure JWT authentication with three distinct roles: `tenant`, `owner`, and `admin`.
- **Bcrypt Password Encryption**: Salt-hashed passwords with 10 rounds of encryption.
- **Route Protection**: Client and server-side authorization guards.

### 2. Property Browsing & Advanced Discovery
- **Multi-Attribute Filters**: Filter by Location (City/State), Property Type (Apartment, Villa, Studio, Penthouse, House), Budget Slider, Bedrooms (1, 2, 3, 4+ BHK), and Furnishing Status.
- **Full-Text Search**: Live keyword search across titles, descriptions, and addresses.
- **Sorting Options**: Sort by newest, price (low-to-high, high-to-low), ratings, or square footage.

### 3. Rich Property Details & Virtual Tours
- **Photo Galleries**: High-resolution image showcases with interactive thumbnail selectors.
- **Virtual Tours**: Embedded walkthrough video tours for remote inspection.
- **Verified Host Profiles**: Direct landlord contact details (Phone & Email) with 0% middleman brokerage.
- **Ratings & Reviews**: Verified tenant reviews with 1-5 star ratings and comments.

### 4. Interactive Booking & Move-In Workflow
- **Custom Move-In Scheduler**: Select preferred move-in dates and lease durations (6 to 36 months).
- **Deposit & Fee Breakdown**: Instant transparent calculation of monthly rent, security deposit, and initial payable amounts.
- **Status Tracking**: Track requests through `pending`, `confirmed`, `rejected`, and `cancelled` states.

### 5. Admin Moderation & Dynamic Dashboard
- **Admin Moderation Queue**: Quality control workflow where newly posted landlord listings remain `pending` until approved by an administrator.
- **Landlord Management Hub**: Manage incoming booking requests (Approve/Decline), track monthly rental revenue, and manage listed properties.
- **Tenant Hub**: View active booking status, move-in timelines, and saved houses.

---

## 🚀 Demo Accounts (1-Click Fill in UI)

For instant testing, preloaded demo accounts are ready:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Platform Admin** | `admin@househunt.com` | `Admin@123` | Moderate pending listings, manage all properties, view platform analytics |
| **Landlord / Owner** | `landlord@househunt.com` | `Landlord@123` | Post properties, edit/delete own listings, approve/decline tenant booking requests |
| **Tenant / Renter** | `renter@househunt.com` | `Renter@123` | Browse homes, submit rental bookings, post reviews |

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router DOM v6, Axios, Bootstrap 5, Lucide React Icons, Plus Jakarta Sans & Outfit typography.
- **Backend**: Node.js, Express.js, Mongoose, JSONWebToken, BcryptJS, Morgan, CORS, Dotenv.
- **Database Engine**: MongoDB with automatic fallback to embedded in-memory MongoDB server for zero-configuration execution.

---

## ⚙️ Quick Start Guide

### 1. Install All Dependencies
Run from project root:
```bash
npm run install-all
```
*(Or `npm install` inside `backend/` and `frontend/` separately).*

### 2. Start Application (Backend + Frontend Concurrently)
```bash
npm run dev
```
- **Frontend App**: `http://localhost:5173`
- **Backend REST API**: `http://localhost:5000`
- **API Health Check**: `http://localhost:5000/api/health`

### 3. Run Automated Integration Tests
```bash
cd backend
node test-integration.js
```

---

## 📁 Project Structure

```
sarathi project/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & embedded fallback
│   ├── controllers/
│   │   ├── authController.js     # Auth, Register, Login, Profile
│   │   ├── propertyController.js # CRUD, Filters, Admin Approval
│   │   ├── bookingController.js  # Booking requests & status
│   │   ├── reviewController.js   # Ratings and reviews
│   │   └── statsController.js    # Platform and owner analytics
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & RBAC guard
│   │   └── errorMiddleware.js    # Centralized error handler
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt
│   │   ├── Property.js           # Property schema with text indexes
│   │   ├── Booking.js            # Booking schema
│   │   └── Review.js             # Review schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── propertyRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── statsRoutes.js
│   ├── seed/
│   │   └── seedData.js           # Initial demo accounts & listings
│   ├── server.js                 # Express server
│   ├── test-integration.js       # End-to-end integration test suite
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Navbar, Footer, ProtectedRoute
│   │   │   ├── properties/       # PropertyCard, PropertyFilterBar
│   │   │   └── bookings/         # BookingModal
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Authentication context & storage
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Hero, stats, featured listings
│   │   │   ├── PropertiesPage.jsx# Search, filters, results grid
│   │   │   ├── PropertyDetailsPage.jsx # Photos, specs, virtual tour, reviews
│   │   │   ├── AddEditPropertyPage.jsx # Form to list/update house
│   │   │   ├── DashboardPage.jsx # Multi-role dashboard
│   │   │   ├── LoginPage.jsx     # Login with 1-click demo pills
│   │   │   ├── RegisterPage.jsx  # Role registration
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/
│   │   │   └── api.js            # Axios client with JWT interceptor
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css             # Design tokens & modern styling
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── package.json                  # Root orchestration (concurrently)
└── README.md
```
