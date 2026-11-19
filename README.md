# 🚗 Smart Car Wash – Online Car Wash Booking System

A full-stack, responsive, and automotive-themed web application built with **React**, **Express.js**, **Node.js**, and **MongoDB**.

Smart Car Wash enables vehicle owners to explore car detailing packages, book appointments with real-time slot verification, manage their garage, apply promotional coupons, track live booking fulfillment, print official tax invoices, and submit service ratings. It also provides an **Administrator Control Center** for fleet, revenue, capacity, and customer management.

---

## 📸 Technology Stack

### Frontend
- **Framework**: React 18 (Vite build system)
- **Styling**: Bootstrap 5 + Custom Automotive CSS Design System
- **Icons**: Lucide React & Bootstrap Icons
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios with Bearer JWT Interceptors & Error Handling
- **State Management**: React Context (`AuthContext`, `ToastContext`)

### Backend
- **Runtime & Framework**: Node.js & Express.js
- **Database & ODM**: MongoDB & Mongoose
- **Authentication**: JWT (JSON Web Tokens) with 7-day expiration
- **Password Security**: bcryptjs 10-round salted hashing
- **Security & Headers**: Helmet, CORS origin controls, Express Rate Limiter
- **Validation**: express-validator schemas for authentication & booking integrity

---

## 🎨 Color Palette & Automotive Theme

| Element | Color Hex | Description |
| :--- | :--- | :--- |
| **Primary** | `#0B132B` | Dark Navy base |
| **Secondary** | `#1C2541` | Deep Blue accent background |
| **Accent** | `#00D4FF` | Electric Cyan Blue highlight |
| **Background** | `#F5F7FA` | Neutral soft contrast |
| **Cards** | `#FFFFFF` | Crisp elevated container surfaces |
| **Success** | `#22C55E` | Booking & payment completed |
| **Warning** | `#F59E0B` | Pending attention |
| **Danger** | `#EF4444` | Cancellations & alerts |

---

## 📂 Project Architecture

```
d:/WT/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── constants.js          # Shared enums (Statuses, Roles, Types)
│   │   │   └── database.js           # Resilient MongoDB connection
│   │   ├── controllers/
│   │   │   ├── adminController.js     # Analytics, revenue, user management
│   │   │   ├── authController.js      # Register, login, profile, passwords
│   │   │   ├── availabilityController.js # Real-time date/slot capacity calculations
│   │   │   ├── bookingController.js   # 8-step booking, atomic slot lock, invoice
│   │   │   ├── contactController.js   # Inbound inquiries & admin responses
│   │   │   ├── couponController.js    # Promo codes & discount algorithms
│   │   │   ├── notificationController.js # Real-time alerts & unread badges
│   │   │   ├── packageController.js   # Bundled packages CRUD
│   │   │   ├── paymentController.js   # Payment order creation & receipt tracking
│   │   │   ├── reviewController.js    # 1-5 star ratings for completed orders
│   │   │   ├── serviceController.js   # 10 Car wash treatments
│   │   │   ├── vehicleController.js   # Customer vehicle garage CRUD
│   │   │   └── washCenterController.js # Service facilities directory
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT bearer verification
│   │   │   ├── errorHandler.js       # Centralized JSON error format
│   │   │   ├── rateLimiter.js        # DDoS & brute-force defense
│   │   │   └── roles.js              # Role authorization guard (CUSTOMER/ADMIN)
│   │   ├── models/
│   │   │   ├── Booking.js            # Booking schema with atomic slot capacity
│   │   │   ├── ContactMessage.js     # Contact inquiries
│   │   │   ├── Coupon.js             # Promo coupons
│   │   │   ├── CouponUsage.js        # Customer redemption tracking
│   │   │   ├── Notification.js       # In-app notifications
│   │   │   ├── Package.js            # Bundled wash packages
│   │   │   ├── PackageService.js     # Relational linking
│   │   │   ├── Payment.js            # Financial transaction records
│   │   │   ├── Review.js             # Ratings & comments
│   │   │   ├── Service.js            # Individual treatments
│   │   │   ├── TimeSlot.js           # Real-time capacity slots
│   │   │   ├── User.js               # Customer & Admin accounts
│   │   │   ├── Vehicle.js            # Registered automobiles
│   │   │   └── WashCenter.js         # Service centers
│   │   ├── routes/                   # Clean Express router mounts
│   │   ├── utils/
│   │   │   └── seed.js               # Comprehensive database seeder
│   │   ├── validators/               # Request validation schemas
│   │   ├── app.js                    # Express app middleware setup
│   │   └── server.js                 # HTTP listener & lifecycle
│   ├── .env                          # Backend environment variables
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Dynamic navigation, badge, profile menu
│   │   │   ├── Footer.jsx            # Automotive footer with links & hours
│   │   │   └── ProtectedRoute.jsx    # Client route guards for users & admins
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Global login state & session persistence
│   │   │   └── ToastContext.jsx      # Global toast notification alerts
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminBookings.jsx # Status updates & fulfillment filters
│   │   │   │   ├── AdminContact.jsx  # Customer inquiries desk
│   │   │   │   ├── AdminDashboard.jsx# Metrics overview & quick feeds
│   │   │   │   ├── AdminPackages.jsx # Package plan CRUD
│   │   │   │   ├── AdminReports.jsx  # Revenue trends & vehicle breakdown
│   │   │   │   ├── AdminServices.jsx # Catalog treatments manager
│   │   │   │   └── AdminUsers.jsx    # Customer directory & suspension toggle
│   │   │   ├── Auth.jsx              # Tabbed Login / Register with Demo Buttons
│   │   │   ├── BookingWizard.jsx     # 8-step booking process with live slots
│   │   │   ├── Contact.jsx           # Facility directory & inquiry form
│   │   │   ├── Dashboard.jsx         # Customer overview & metrics
│   │   │   ├── Home.jsx              # Landing page (Hero, Stats, FAQs, Packages)
│   │   │   ├── MyBookings.jsx        # History, reschedule, cancel, invoice
│   │   │   ├── MyReviews.jsx         # Customer ratings & reviews
│   │   │   ├── Notifications.jsx     # Alert feed with unread badges
│   │   │   ├── Packages.jsx          # Plans & interactive comparison matrix
│   │   │   ├── Profile.jsx           # Profile details & password change
│   │   │   ├── Services.jsx          # 10 Services with category filters & search
│   │   │   └── Vehicles.jsx          # Garage manager (Add/Edit/Delete vehicles)
│   │   ├── services/
│   │   │   └── api.js                # Axios client with JWT interceptor
│   │   ├── App.jsx                   # Central route tree
│   │   ├── index.css                 # Automotive design system & responsive styling
│   │   └── main.jsx                  # React application entry
│   ├── index.html                    # HTML shell with Google Fonts
│   ├── vite.config.js                # Vite build & proxy config
│   └── package.json
│
├── package.json                      # Top-level workspace script runner
└── README.md
```

---

## 🔑 Demo Login Credentials

For quick evaluation, one-click demo login buttons are built right into the **Sign In** screen:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@smartcarwash.com` | `Admin@123` | Full Admin Dashboard, Revenue Analytics, All Bookings, Catalog Management |
| **Customer** | `john@example.com` | `Customer@123` | Garage management, 8-Step Booking, Invoices, Reschedule, Reviews |

---

## 🚀 Step-by-Step Launch Instructions

### 1. Database Setup (MongoDB)
Ensure MongoDB is running locally on port 27017 or provide your free MongoDB Atlas URI in `backend/.env`:
```properties
MONGODB_URI=mongodb://127.0.0.1:27017/smart_car_wash_db
```

### 2. Populate Sample Data (Optional / Recommended)
To immediately populate the database with realistic services, packages, wash centers, sample bookings, coupons, and test accounts:
```bash
cd d:\WT\backend
npm run seed
```

### 3. Start the Express Backend API
```bash
cd d:\WT\backend
npm run dev
```
*Backend will launch on **http://localhost:5000** (Health check: **http://localhost:5000/api/health**)*

### 4. Start the React Frontend
In a second terminal window:
```bash
cd d:\WT\frontend
npm run dev
```
*Frontend will launch on **http://localhost:3000**.*

---

## 🚗 Key Features Implemented

### 1. Multi-Step Booking Wizard
1. **Vehicle Selection**: Pick from registered vehicles or use the inline quick-registration modal.
2. **Treatment Selection**: Toggle between Bundled Packages or A La Carte individual services.
3. **Wash Facility**: Choose between Central Hub (Connaught Place), Westside Auto Spa, or Cyber City.
4. **Date Selection**: Calendar picker automatically disallows past dates.
5. **Real-Time Time Slot**: Fetches live capacity directly from MongoDB; fully booked or past slots are disabled.
6. **Summary & Coupons**: Calculates 18% GST tax server-side, validates promo codes (e.g. `WELCOME50`, `SMARTWASH`), and applies instant discounts.
7. **Payment Selection**: Supports Pay at Center (Cash / UPI) or Instant Simulated Online Payment.
8. **Confirmation & Invoice**: Issues a unique reference ID (e.g. `SCW-XXXXX`) and printable official invoice.

### 2. Customer Garage Management
- Register multiple vehicles with license plates, category tags (Hatchback, Sedan, SUV, Luxury, Pickup), fuel type, and color.
- Edit vehicle details or remove obsolete cars.
- Mark primary default vehicle for swift bookings.

### 3. Booking Management
- View bookings segmented by **All**, **Upcoming**, **Completed**, and **Cancelled**.
- Real-time **Reschedule** modal allowing customer to pick a new date and open slot.
- **Cancel** modal releasing slot capacity atomically back to the center's pool.
- Printable, branded official Tax Invoice receipt.
- **Review Service** button for completed appointments with 1–5 star ratings.

### 4. Administrator Operations
- Overview tiles: Total Customers, Total Vehicles, Total Bookings, Today's Appointments, Total Revenue, and Monthly Revenue.
- Full booking fulfillment manager with status changer (`CONFIRMED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`).
- User account directory with one-click suspension / activation toggle.
- Catalog management: add, edit, or delete services and pricing packages.
- Revenue trends analytics bar charts and vehicle category distribution.
