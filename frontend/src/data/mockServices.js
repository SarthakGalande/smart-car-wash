export const mockServices = [
  // ==========================================
  // EXTERIOR (4 Services)
  // ==========================================
  {
    _id: 'srv_ext_1',
    serviceName: 'Exterior Snow Foam Wash',
    slug: 'exterior-foam-wash',
    description: 'High-pressure underbody rinse, active pH-neutral snow foam bath, two-bucket scratch-free mitt wash, and ultra-gloss tire dressing.',
    price: 199,
    duration: 30,
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
    features: ['High-Pressure Underbody Blast', 'German Snow Foam Soak', 'Plush Microfiber Hand Dry', 'High-Gloss Tire Gel'],
    category: 'Exterior',
    isPopular: true,
    rating: 4.8,
    reviewCount: 164
  },
  {
    _id: 'srv_ext_2',
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
    _id: 'srv_ext_3',
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
    _id: 'srv_ext_4',
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

  // ==========================================
  // INTERIOR (4 Services)
  // ==========================================
  {
    _id: 'srv_int_1',
    serviceName: 'Deep Cabin Steam Sanitization',
    slug: 'interior-steam-sanitization',
    description: '140°C pressurized dry steam sanitization penetrating deep into upholstery, AC vents, dashboard seams, and high-touch contact points.',
    price: 349,
    duration: 45,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    features: ['140°C Germ & Bacteria Steam', 'AC Vent System Flush', 'Dashboard & Console Detail', 'Odor-Free Cabin Air'],
    category: 'Interior',
    isPopular: true,
    rating: 4.9,
    reviewCount: 204
  },
  {
    _id: 'srv_int_2',
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
    _id: 'srv_int_3',
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
    _id: 'srv_int_4',
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

  // ==========================================
  // COMPLETE (4 Services)
  // ==========================================
  {
    _id: 'srv_cmp_1',
    serviceName: 'Complete Signature Car Wash',
    slug: 'complete-car-wash',
    description: 'Full exterior foam wash, underbody rinse, deep cabin vacuuming, dashboard and door card conditioning, tire shine, and signature scent.',
    price: 499,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80',
    features: ['Full Exterior Foam Wash', 'Deep Interior Vacuum', 'Trunk Cleaned & Dressed', 'Tire Dressing & Rim Polish', 'Premium Fragrance Spray'],
    category: 'Complete',
    isPopular: true,
    rating: 4.9,
    reviewCount: 380
  },
  {
    _id: 'srv_cmp_2',
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
    _id: 'srv_cmp_3',
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
    _id: 'srv_cmp_4',
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

  // ==========================================
  // DETAILING (4 Services)
  // ==========================================
  {
    _id: 'srv_det_1',
    serviceName: 'Premium 3-Stage Paint Correction',
    slug: 'premium-detailing',
    description: 'Precision dual-action machine polishing compounding swirl marks, light scratches, oxidation, and holograms to restore mirror clarity.',
    price: 1499,
    duration: 150,
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80',
    features: ['Swirl & Scratch Removal (85%+)', 'Dual-Action Machine Polishing', 'Paint Depth Gauge Inspection', 'Synthetic Polymer Sealant'],
    category: 'Detailing',
    isPopular: true,
    rating: 5.0,
    reviewCount: 228
  },
  {
    _id: 'srv_det_2',
    serviceName: '9H Nano-Ceramic Armor Coating',
    slug: 'ceramic-coating',
    description: 'Military-grade 9H silicon dioxide (SiO2) permanent chemical bond yielding extreme hydrophobicity, UV resistance, and intense showroom luster.',
    price: 2999,
    duration: 240,
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    features: ['9H Certified Ceramic Shield', 'Superhydrophobic Water Beading', '3-Year Paint Warranty', 'Anti-Corrosion & UV Shield'],
    category: 'Detailing',
    isPopular: true,
    rating: 5.0,
    reviewCount: 194
  },
  {
    _id: 'srv_det_3',
    serviceName: 'Brazilian Carnauba Wax High-Gloss Buff',
    slug: 'wax-and-polish',
    description: 'Grade-1 Brazilian yellow Carnauba wax hand-spread and machine buffed for deep wet reflections, slick surface feel, and short-term water runoff.',
    price: 599,
    duration: 50,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    features: ['Pure Grade-1 Carnauba Wax', 'Deep Wet-Look Warm Reflection', 'Hand-Applied & Machine Buffed', 'UV Solar Protection'],
    category: 'Detailing',
    isPopular: false,
    rating: 4.9,
    reviewCount: 140
  },
  {
    _id: 'srv_det_4',
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

  // ==========================================
  // SPECIALIZED (4 Services)
  // ==========================================
  {
    _id: 'srv_spc_1',
    serviceName: 'Engine Bay Steam Degreasing & Dressing',
    slug: 'engine-cleaning',
    description: 'Safe low-moisture steam degreasing of alternator-protected engine compartments, removing road oil and grime, followed by factory satin dressing.',
    price: 349,
    duration: 35,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    features: ['Low-Moisture Steam Degreasing', 'Sensitive Electrical Sensor Masking', 'Rubber & Hose Conditioning', 'Prevents Premature Dry Rot'],
    category: 'Specialized',
    isPopular: false,
    rating: 4.8,
    reviewCount: 96
  },
  {
    _id: 'srv_spc_2',
    serviceName: 'Eco-Smart Waterless Wash & Polymer Coat',
    slug: 'waterless-car-wash',
    description: 'Biodegradable encapsulating formula lifting dirt safely without scratch marks while saving 200+ liters of water, finished with polymer gloss.',
    price: 249,
    duration: 30,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    features: ['Zero Water Waste Eco-Formula', 'Micro-Encapsulation Technology', 'Anti-Static Dust Repellent', 'Ideal for Apartment Parking'],
    category: 'Specialized',
    isPopular: false,
    rating: 4.7,
    reviewCount: 65
  },
  {
    _id: 'srv_spc_3',
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
    _id: 'srv_spc_4',
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
