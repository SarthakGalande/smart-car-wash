require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Service = require('../models/Service');
const Package = require('../models/Package');
const PackageService = require('../models/PackageService');
const WashCenter = require('../models/WashCenter');
const TimeSlot = require('../models/TimeSlot');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const Coupon = require('../models/Coupon');
const { ROLES, BOOKING_STATUS, PAYMENT_STATUS, PAYMENT_METHODS, NOTIFICATION_TYPES } = require('../config/constants');

const seedData = async (exitOnComplete = (require.main === module)) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_car_wash_db';
      console.log(`Connecting to MongoDB at: ${mongoUri}...`);
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      console.log('Connected to MongoDB for database seeding.');
    }

    // Clear existing collections safely
    await Promise.all([
      User.deleteMany({}),
      Vehicle.deleteMany({}),
      Service.deleteMany({}),
      Package.deleteMany({}),
      PackageService.deleteMany({}),
      WashCenter.deleteMany({}),
      TimeSlot.deleteMany({}),
      Booking.deleteMany({}),
      Payment.deleteMany({}),
      Review.deleteMany({}),
      Notification.deleteMany({}),
      Coupon.deleteMany({})
    ]);
    console.log('Cleared existing collections.');

    // 1. Create Users
    const adminUser = await User.create({
      fullName: 'System Administrator',
      email: 'admin@smartcarwash.com',
      phone: '+91 99999 88888',
      password: 'Admin@123',
      role: ROLES.ADMIN,
      status: 'ACTIVE',
      address: { street: '100 Car Spa Avenue', city: 'New Delhi', state: 'Delhi', zipCode: '110001' }
    });

    const demoCustomer = await User.create({
      fullName: 'John Anderson',
      email: 'john@example.com',
      phone: '+91 98765 43210',
      password: 'Customer@123',
      role: ROLES.CUSTOMER,
      status: 'ACTIVE',
      address: { street: '42 Baker Street', city: 'New Delhi', state: 'Delhi', zipCode: '110025' }
    });

    console.log('Seeded Users: Admin (admin@smartcarwash.com) & Demo Customer (john@example.com)');

    // 2. Create Vehicles
    const vehicle1 = await Vehicle.create({
      user: demoCustomer._id,
      brand: 'BMW',
      model: '330i M Sport',
      registrationNumber: 'DL 01 AB 1234',
      vehicleType: 'Sedan',
      fuelType: 'Petrol',
      color: 'Portimao Blue',
      isDefault: true
    });

    const vehicle2 = await Vehicle.create({
      user: demoCustomer._id,
      brand: 'Hyundai',
      model: 'Creta SX(O)',
      registrationNumber: 'HR 26 DK 8899',
      vehicleType: 'SUV',
      fuelType: 'Diesel',
      color: 'Polar White',
      isDefault: false
    });

    console.log('Seeded Vehicles for John Anderson.');

    // 3. Create 22 Comprehensive Services (Exterior, Interior, Complete, Detailing, Specialized)
    const servicesData = [
      // --- EXTERIOR ---
      {
        serviceName: 'Exterior Wash',
        slug: 'exterior-wash',
        description: 'High-pressure underbody rinse, snow foam hand wash, microfiber drying, and high-gloss tire dressing.',
        price: 199,
        duration: 30,
        image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
        features: ['High-Pressure Rinse', 'Snow Foam Bath', 'Microfiber Hand Dry', 'Tire Dressing'],
        category: 'Exterior',
        isPopular: true,
        rating: 4.8,
        reviewCount: 142
      },
      {
        serviceName: 'Foam Wash',
        slug: 'foam-wash',
        description: 'Thick snow foam coating that clings and dissolves dirt safely without scratching clear coat, followed by spotless rinse.',
        price: 249,
        duration: 35,
        image: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=800&q=80',
        features: ['pH-Balanced Snow Foam', 'Two-Bucket Hand Scrub', 'Alloy Wheel Scrub', 'Spotless Water Rinse'],
        category: 'Exterior',
        isPopular: false,
        rating: 4.7,
        reviewCount: 76
      },
      {
        serviceName: 'Hydrophobic Glass & Windshield Shield',
        slug: 'hydrophobic-glass-shield',
        description: 'Deep mineral deposit and road film strip from all vehicle glass followed by a multi-month hydrophobic rain-repellent ceramic coating.',
        price: 249,
        duration: 25,
        image: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=800&q=80',
        features: ['Glass Acid Rain Decontamination', 'Microfiber Streak-Free Polish', 'Hydrophobic Water Beading Film', 'Wiper Blade De-greasing'],
        category: 'Exterior',
        isPopular: false,
        rating: 4.7,
        reviewCount: 92
      },
      {
        serviceName: 'Wheel Armor & Caliper De-Ironing',
        slug: 'wheel-armor-caliper',
        description: 'pH-neutral iron fall-out chemical dissolver that dissolves baked-on corrosive brake dust, wheel barrel scrubbing, and anti-static tire shield.',
        price: 299,
        duration: 30,
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
        features: ['Brake Dust Iron Dissolver', 'Inner Barrel & Caliper Scrub', 'Alloy Rim Protective Sealant', 'Satin Deep Tire Dressing'],
        category: 'Exterior',
        isPopular: false,
        rating: 4.9,
        reviewCount: 118
      },
      {
        serviceName: 'Clay Mitt Decontamination & Foam Bath',
        slug: 'snow-foam-clay-mitt',
        description: 'Double snow foam pre-wash coupled with a synthetic clay mitt glide to safely remove tree sap, industrial fallout, and embedded road tar.',
        price: 349,
        duration: 35,
        image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80',
        features: ['Surface Tar & Sap Removal', 'Synthetic Fine Clay Glide', 'Two-Bucket Hand Mitt Wash', 'Silk Drying Towel Finish'],
        category: 'Exterior',
        isPopular: false,
        rating: 4.8,
        reviewCount: 85
      },

      // --- INTERIOR ---
      {
        serviceName: 'Interior Cleaning',
        slug: 'interior-cleaning',
        description: 'Deep cabin vacuuming, dashboard and console detailing, glass streak-free cleaning, and fresh air vent sanitization.',
        price: 299,
        duration: 45,
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
        features: ['Seats & Carpet Vacuuming', 'Dashboard Conditioned', 'Door Panels Cleaned', 'AC Vent Sanitization'],
        category: 'Interior',
        isPopular: true,
        rating: 4.9,
        reviewCount: 98
      },
      {
        serviceName: 'Interior Vacuum Cleaning',
        slug: 'interior-vacuum-cleaning',
        description: 'Intense industrial vacuum extraction targeting pet hair, sand, crumbs, and trapped dust in upholstery and crevices.',
        price: 199,
        duration: 25,
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
        features: ['Seats Vacuumed', 'Carpet Deep Extraction', 'Trunk & Spare Wheel Well', 'Crevice Dust Removal'],
        category: 'Interior',
        isPopular: false,
        rating: 4.6,
        reviewCount: 52
      },
      {
        serviceName: 'Deep Cabin Steam Sanitization',
        slug: 'interior-steam-sanitization',
        description: '140°C pressurized dry steam sanitization penetrating deep into upholstery, AC vents, dashboard seams, and high-touch contact points.',
        price: 349,
        duration: 45,
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
        features: ['140°C Germ & Bacteria Steam', 'AC Vent System Flush', 'Dashboard & Console Detail', 'Odor-Free Cabin Air'],
        category: 'Interior',
        isPopular: false,
        rating: 4.9,
        reviewCount: 204
      },
      {
        serviceName: 'Upholstery & Carpet Deep Extraction',
        slug: 'upholstery-carpet-extraction',
        description: 'Industrial hot water injection extraction targeting stubborn coffee spills, ground-in mud, pet hair, and allergens trapped deep in carpets.',
        price: 399,
        duration: 50,
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
        features: ['Hot Water Injection Extraction', 'Enzymatic Stain Treatment', 'Heavy Pet Hair Removal', 'Fast-Drying Moisture Vac'],
        category: 'Interior',
        isPopular: false,
        rating: 4.8,
        reviewCount: 147
      },
      {
        serviceName: 'Leather Luxury Conditioning & UV Shield',
        slug: 'leather-luxury-conditioning',
        description: 'Gentle pH-neutral leather cleansing using soft horsehair brushes followed by vitamin E & lanolin balm to restore suppleness and UV protection.',
        price: 449,
        duration: 40,
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
        features: ['Horsehair Leather Cleansing', 'Lanolin Nourishing Balm', 'Anti-Cracking UV Barrier', 'Matte Non-Greasy Finish'],
        category: 'Interior',
        isPopular: false,
        rating: 5.0,
        reviewCount: 95
      },
      {
        serviceName: 'Interior Ozone Odor & Mold Elimination',
        slug: 'interior-odor-ozone-blast',
        description: 'Medical-grade ozone gas shock treatment that circulates through ventilation channels, neutralizing smoke, mildew, food, and pet odors.',
        price: 299,
        duration: 30,
        image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
        features: ['Ozone Gas Molecule Neutralizer', 'Eliminates Smoke & Pet Odors', 'Kills Mold Spores in Vents', 'Hospital-Grade Freshness'],
        category: 'Interior',
        isPopular: false,
        rating: 4.7,
        reviewCount: 68
      },

      // --- COMPLETE ---
      {
        serviceName: 'Complete Car Wash',
        slug: 'complete-car-wash',
        description: 'Full exterior foam wash, deep interior vacuuming, dashboard and trim conditioning, door jamb cleaning, and fragrance spray.',
        price: 499,
        duration: 60,
        image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80',
        features: ['Full Exterior Foam Wash', 'Deep Interior Vacuum', 'Trunk Cleaned', 'Tire Dressing & Rim Shine', 'Fresh Interior Scent'],
        category: 'Complete',
        isPopular: true,
        rating: 4.9,
        reviewCount: 312
      },
      {
        serviceName: 'Executive Showroom Restoration',
        slug: 'executive-showroom-treatment',
        description: 'Comprehensive bumper-to-bumper transformation: exterior clay foam bath, engine bay low-moisture clean, interior steam, and Carnauba wax buff.',
        price: 899,
        duration: 90,
        image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80',
        features: ['Complete In & Out Cleansing', 'Engine Bay Steam Degrease', 'Carnauba Hand Wax Buff', 'Full Interior Steam Sanitize'],
        category: 'Complete',
        isPopular: true,
        rating: 5.0,
        reviewCount: 215
      },
      {
        serviceName: 'Express In-and-Out Care',
        slug: 'express-in-and-out',
        description: 'Synchronized dual-technician service: fast exterior contact wash, hand dry, floor mats vacuum, console dusting, and windshield clean.',
        price: 349,
        duration: 35,
        image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
        features: ['Dual-Tech Rapid Turnaround', 'Exterior Foam Hand Wash', 'Floor Mats & Seats Vacuumed', 'Streak-Free Windshield'],
        category: 'Complete',
        isPopular: false,
        rating: 4.7,
        reviewCount: 130
      },
      {
        serviceName: 'All-Weather Armor Wash & Seal',
        slug: 'all-weather-armor-wash',
        description: 'Heavy mud & grime dissolution, pressurized wheel well flush, protective undercarriage barrier, and polymer paint sealant for tough road conditions.',
        price: 599,
        duration: 70,
        image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
        features: ['Heavy Mud & Slush Removal', 'Undercarriage Salt/Rust Flush', 'Polymer Spray Sealant (60 Days)', 'Hydrophobic Glass Treatment'],
        category: 'Complete',
        isPopular: false,
        rating: 4.8,
        reviewCount: 112
      },

      // --- DETAILING ---
      {
        serviceName: 'Premium Detailing',
        slug: 'premium-detailing',
        description: 'Showroom finish detailing with paint decontamination, clay bar scrub, machine polish, and premium polymer sealant.',
        price: 1199,
        duration: 120,
        image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80',
        features: ['Clay Bar Decontamination', 'Swirl Mark Reduction', 'Machine Polish', 'Polymer Paint Sealant', 'Leather Conditioning'],
        category: 'Detailing',
        isPopular: true,
        rating: 5.0,
        reviewCount: 185
      },
      {
        serviceName: 'Wax and Polish',
        slug: 'wax-and-polish',
        description: 'Brazilian Carnauba hand-applied wax buffed to a mirror reflection, creating a hydrophobic water-repelling barrier.',
        price: 599,
        duration: 50,
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
        features: ['Authentic Carnauba Wax', 'Hydrophobic Water Beading', 'UV Sun Protection', 'High-Gloss Depth'],
        category: 'Detailing',
        isPopular: true,
        rating: 4.9,
        reviewCount: 110
      },
      {
        serviceName: 'Ceramic Coating',
        slug: 'ceramic-coating',
        description: '9H nano-ceramic chemical bond layer providing semi-permanent scratch resistance, extreme gloss, and weather protection.',
        price: 2999,
        duration: 240,
        image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
        features: ['9H Hardness Protection', 'Self-Cleaning Hydrophobic Effect', '3-Year Paint Warranty', 'Anti-Oxidation Shield'],
        category: 'Detailing',
        isPopular: false,
        rating: 5.0,
        reviewCount: 88
      },
      {
        serviceName: 'Headlight UV Restoration & Clarification',
        slug: 'headlight-uv-restoration',
        description: 'Multi-stage wet sanding and optical compounding to remove oxidation and yellowing, finished with a permanent UV-blocking polymer clear coat.',
        price: 399,
        duration: 40,
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
        features: ['Wet-Sanding Oxidation Removal', 'Optical Clarity Polishing', 'Permanent UV Clear Shield', 'Restores Nighttime Beam Distance'],
        category: 'Detailing',
        isPopular: false,
        rating: 4.8,
        reviewCount: 77
      },

      // --- SPECIALIZED ---
      {
        serviceName: 'Engine Cleaning',
        slug: 'engine-cleaning',
        description: 'Careful degreasing and low-moisture steam wash of the engine bay, followed by heat-resistant protective dressing.',
        price: 349,
        duration: 30,
        image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
        features: ['Safe Low-Moisture Steam', 'Grease & Oil Removal', 'Plastic & Rubber Shield', 'Corrosion Prevention'],
        category: 'Specialized',
        isPopular: false,
        rating: 4.8,
        reviewCount: 64
      },
      {
        serviceName: 'Waterless Car Wash',
        slug: 'waterless-car-wash',
        description: 'Eco-conscious cleaning utilizing plant-based lubricants that lift dirt safely without running gallons of water.',
        price: 229,
        duration: 30,
        image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
        features: ['100% Eco-Friendly & Zero Water Waste', 'Scratch-Free Lubrication', 'Polymer Shine Coat', 'Convenient & Fast'],
        category: 'Specialized',
        isPopular: false,
        rating: 4.7,
        reviewCount: 41
      },
      {
        serviceName: 'Undercarriage Anti-Rust & Sound Barrier',
        slug: 'undercarriage-anti-rust',
        description: 'High-pressure underbody power wash followed by application of durable rubberized bitumen spray protecting against salt corrosion and road noise.',
        price: 699,
        duration: 60,
        image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
        features: ['High-Pressure Chassis Flush', 'Heavy-Duty Bitumen Coating', 'Road Debris & Salt Shield', 'Reduces Cabin Road Hum'],
        category: 'Specialized',
        isPopular: false,
        rating: 4.9,
        reviewCount: 84
      },
      {
        serviceName: 'Convertible Fabric Soft-Top Waterproofing',
        slug: 'convertible-soft-top-waterproofing',
        description: 'Low-pressure enzymatic scrub removing moss and traffic film from canvas roofs, dried and treated with hydrophobic fluoropolymer water shield.',
        price: 799,
        duration: 60,
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
        features: ['Canvas Deep Chemical Scrub', 'Anti-Mildew Stain Treatment', 'Fluoropolymer Waterproof Barrier', 'Restores Deep Black/Navy Color'],
        category: 'Specialized',
        isPopular: false,
        rating: 5.0,
        reviewCount: 42
      }
    ];

    const createdServices = await Service.insertMany(servicesData);
    console.log(`Seeded ${createdServices.length} car wash services.`);

    // 4. Create 4 Packages with Relations
    const sMap = {};
    createdServices.forEach(s => { sMap[s.slug] = s._id; });

    const packagesData = [
      {
        packageName: 'Basic Wash',
        slug: 'basic-wash',
        description: 'Ideal for weekly maintenance to keep your car shining and clean on the outside.',
        price: 199,
        duration: 30,
        features: [
          'Exterior foam wash',
          'Basic cleaning & wheel rinse',
          'Microfiber hand drying',
          'Tire shine spray'
        ],
        includedServices: [sMap['exterior-wash']],
        popular: false,
        badge: '',
        status: 'ACTIVE'
      },
      {
        packageName: 'Standard Wash',
        slug: 'standard-wash',
        description: 'The balanced package combining exterior brilliance with a clean, dust-free cabin.',
        price: 399,
        duration: 60,
        features: [
          'Full exterior foam wash',
          'Interior vacuum cleaning',
          'Dashboard & console wipe',
          'Windows streak-free cleaning',
          'Underbody splash wash'
        ],
        includedServices: [sMap['exterior-wash'], sMap['interior-vacuum-cleaning']],
        popular: false,
        badge: '',
        status: 'ACTIVE'
      },
      {
        packageName: 'Premium Wash',
        slug: 'premium-wash',
        description: 'Comprehensive deep rejuvenation inside and out with top-tier conditioning and polishing.',
        price: 699,
        duration: 90,
        features: [
          'Exterior snow foam bath',
          'Interior deep steam cleaning',
          'Tyre dressing & rim polishing',
          'Dashboard & leather UV conditioner',
          'Rain-repellent windshield treatment',
          'Fresh ambient fragrance'
        ],
        includedServices: [sMap['complete-car-wash'], sMap['interior-cleaning']],
        popular: true,
        badge: 'Most Popular',
        status: 'ACTIVE'
      },
      {
        packageName: 'Ultimate Detailing',
        slug: 'ultimate-detailing',
        description: 'The connoisseur treatment: complete interior shampoo, paint correction, wax buffing, and engine bay detailing.',
        price: 1499,
        duration: 180,
        features: [
          'Complete interior upholstery extraction',
          'Exterior paint decontamination & polish',
          'Brazilian Carnauba wax gloss finish',
          'Engine bay steam cleaning & dressing',
          'Alloy wheel ceramic sealant',
          '3-step odor neutralization'
        ],
        includedServices: [sMap['premium-detailing'], sMap['engine-cleaning'], sMap['wax-and-polish']],
        popular: false,
        badge: 'Best Value',
        status: 'ACTIVE'
      }
    ];

    const createdPackages = await Package.insertMany(packagesData);
    console.log(`Seeded ${createdPackages.length} car wash packages.`);

    // 5. Create 3 Wash Centers
    const centersData = [
      {
        centerName: 'Smart Car Wash - Downtown Hub',
        address: 'Plot 14, Barakhamba Road, Connaught Place',
        city: 'New Delhi',
        phone: '+91 98765 43210',
        email: 'downtown@smartcarwash.com',
        openingTime: '08:00 AM',
        closingTime: '08:00 PM',
        capacityPerSlot: 4,
        rating: 4.9
      },
      {
        centerName: 'Smart Car Wash - Westside Auto Spa',
        address: 'B-23, Ring Road, Rajouri Garden',
        city: 'New Delhi',
        phone: '+91 98765 43211',
        email: 'westside@smartcarwash.com',
        openingTime: '08:00 AM',
        closingTime: '08:00 PM',
        capacityPerSlot: 3,
        rating: 4.8
      },
      {
        centerName: 'Smart Car Wash - Cyber City Detailing',
        address: 'Tower C Concourse, DLF Cyber City, Phase 2',
        city: 'Gurugram',
        phone: '+91 98765 43212',
        email: 'cybercity@smartcarwash.com',
        openingTime: '08:00 AM',
        closingTime: '09:00 PM',
        capacityPerSlot: 5,
        rating: 4.9
      }
    ];

    const createdCenters = await WashCenter.insertMany(centersData);
    console.log(`Seeded ${createdCenters.length} wash centers.`);

    // 6. Create Coupons
    const couponsData = [
      {
        code: 'WELCOME50',
        description: '50% off on your first car wash booking up to ₹200',
        discountType: 'PERCENTAGE',
        discountValue: 50,
        minBookingAmount: 299,
        maxDiscount: 200,
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        usageLimit: 500,
        status: 'ACTIVE'
      },
      {
        code: 'SMARTWASH',
        description: 'Flat ₹100 off on any premium package booking',
        discountType: 'FLAT',
        discountValue: 100,
        minBookingAmount: 399,
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        usageLimit: 300,
        status: 'ACTIVE'
      },
      {
        code: 'FESTIVE25',
        description: '25% festive discount on all car wash detailing',
        discountType: 'PERCENTAGE',
        discountValue: 25,
        minBookingAmount: 499,
        maxDiscount: 300,
        validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        usageLimit: 200,
        status: 'ACTIVE'
      }
    ];

    await Coupon.insertMany(couponsData);
    console.log('Seeded promotional coupons.');

    // 7. Seed Past & Upcoming Bookings for Demo User
    const center1 = createdCenters[0];
    const pkgPremium = createdPackages[2];
    const pkgStandard = createdPackages[1];

    // Completed past booking
    const pastBooking = await Booking.create({
      bookingReference: 'SCW-74291841',
      user: demoCustomer._id,
      vehicle: vehicle1._id,
      vehicleSnapshot: {
        brand: vehicle1.brand,
        model: vehicle1.model,
        registrationNumber: vehicle1.registrationNumber,
        vehicleType: vehicle1.vehicleType,
        color: vehicle1.color
      },
      center: center1._id,
      package: pkgPremium._id,
      services: [],
      bookingDate: '2026-11-10',
      timeSlot: '10:00 AM - 11:00 AM',
      basePrice: 699,
      packagePrice: 699,
      servicesPrice: 0,
      discountAmount: 100,
      taxAmount: 107.82,
      finalAmount: 706.82,
      bookingStatus: BOOKING_STATUS.COMPLETED,
      paymentStatus: PAYMENT_STATUS.PAID,
      paymentMethod: PAYMENT_METHODS.ONLINE,
      notes: 'Car was sparkling clean. Exceptional service!'
    });

    await Payment.create({
      booking: pastBooking._id,
      user: demoCustomer._id,
      transactionId: 'TXN-99882211',
      paymentMethod: PAYMENT_METHODS.ONLINE,
      amount: 706.82,
      paymentStatus: PAYMENT_STATUS.PAID,
      gatewayDetails: {
        orderId: 'order_mock_123',
        paymentId: 'pay_mock_456'
      }
    });

    // Sample review for completed booking
    await Review.create({
      user: demoCustomer._id,
      booking: pastBooking._id,
      package: pkgPremium._id,
      rating: 5,
      comment: 'Top-tier service! My BMW 3 Series looks better than the day I drove it out of the showroom. Highly recommended!',
      isApproved: true,
      adminResponse: 'Thank you for your fantastic review, John! Looking forward to welcoming you back.'
    });

    // Upcoming booking for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    await Booking.create({
      bookingReference: 'SCW-88129304',
      user: demoCustomer._id,
      vehicle: vehicle2._id,
      vehicleSnapshot: {
        brand: vehicle2.brand,
        model: vehicle2.model,
        registrationNumber: vehicle2.registrationNumber,
        vehicleType: vehicle2.vehicleType,
        color: vehicle2.color
      },
      center: center1._id,
      package: pkgStandard._id,
      services: [],
      bookingDate: tomorrowStr,
      timeSlot: '02:00 PM - 03:00 PM',
      basePrice: 399,
      packagePrice: 399,
      servicesPrice: 0,
      discountAmount: 0,
      taxAmount: 71.82,
      finalAmount: 470.82,
      bookingStatus: BOOKING_STATUS.CONFIRMED,
      paymentStatus: PAYMENT_STATUS.PENDING,
      paymentMethod: PAYMENT_METHODS.CASH,
      notes: 'Please pay extra attention to the floor mats.'
    });

    // Sample notifications
    await Notification.create([
      {
        user: demoCustomer._id,
        title: 'Booking Confirmed! 🚗🎉',
        message: `Your booking #SCW-88129304 for tomorrow at 02:00 PM is confirmed at ${center1.centerName}.`,
        type: NOTIFICATION_TYPES.BOOKING_CONFIRMED,
        isRead: false,
        link: '/dashboard/my-bookings'
      },
      {
        user: demoCustomer._id,
        title: 'Wash Completed ✨',
        message: 'Your vehicle service on Nov 10th was completed. Thank you for booking with us!',
        type: NOTIFICATION_TYPES.SERVICE_COMPLETED,
        isRead: true,
        link: '/dashboard/my-bookings'
      }
    ]);

    console.log('Database seeding complete! All initial records populated successfully.');
    if (exitOnComplete) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Error during database seed:', error);
    if (exitOnComplete) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  seedData(true);
}

module.exports = seedData;
