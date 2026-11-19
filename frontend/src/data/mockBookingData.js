export const fallbackCenters = [
  {
    _id: 'center_1',
    centerName: 'Smart Car Wash - Downtown Hub',
    address: 'Plot 14, Barakhamba Road, Connaught Place',
    city: 'New Delhi',
    phone: '+91 98765 43210',
    openingTime: '08:00 AM',
    closingTime: '08:00 PM',
    capacityPerSlot: 4
  },
  {
    _id: 'center_2',
    centerName: 'Smart Car Wash - South Ext Center',
    address: 'Ring Road, Near Metro Station, South Extension Part II',
    city: 'New Delhi',
    phone: '+91 98765 43211',
    openingTime: '08:00 AM',
    closingTime: '08:00 PM',
    capacityPerSlot: 4
  },
  {
    _id: 'center_3',
    centerName: 'Smart Car Wash - CyberHub Facility',
    address: 'DLF Cyber City, Phase 2, Sector 24',
    city: 'Gurgaon',
    phone: '+91 98765 43212',
    openingTime: '08:00 AM',
    closingTime: '08:00 PM',
    capacityPerSlot: 5
  }
];

export const fallbackPackages = [
  {
    _id: 'pkg_1',
    packageName: 'Basic Wash',
    slug: 'basic-wash',
    description: 'Essential exterior cleaning with high-pressure rinse and microfiber drying.',
    price: 199,
    duration: 30,
    features: ['Exterior Wash', 'Tire Dressing', 'Microfiber Hand Dry'],
    popular: false
  },
  {
    _id: 'pkg_2',
    packageName: 'Standard Care',
    slug: 'standard-care',
    description: 'Complete exterior foam bath coupled with deep interior vacuuming.',
    price: 349,
    duration: 45,
    features: ['Exterior Wash', 'Interior Vacuum', 'Dashboard Dusting', 'Tire Glaze'],
    popular: false
  },
  {
    _id: 'pkg_3',
    packageName: 'Complete Clean',
    slug: 'complete-clean',
    description: 'All-around inside and outside rejuvenation with trim dressing.',
    price: 699,
    duration: 75,
    features: ['Exterior Foam Wash', 'Deep Interior Clean', 'AC Vent Sanitize', 'Rim Polish', 'Car Scent'],
    popular: true,
    badge: 'Most Popular'
  },
  {
    _id: 'pkg_4',
    packageName: 'Showroom Detail',
    slug: 'showroom-detail',
    description: 'The pinnacle of vehicle pampering with machine polishing and steam cleanse.',
    price: 1499,
    duration: 150,
    features: ['3-Stage Machine Polish', 'Engine Bay Steam', 'Carnauba Hand Wax', 'Leather Balm', 'Rain Repellent'],
    popular: false
  }
];

export const fallbackSlots = [
  { id: 'slot_1', timeSlot: '08:00 AM - 09:00 AM', remainingSpots: 4, isAvailable: true },
  { id: 'slot_2', timeSlot: '09:00 AM - 10:00 AM', remainingSpots: 4, isAvailable: true },
  { id: 'slot_3', timeSlot: '10:00 AM - 11:00 AM', remainingSpots: 3, isAvailable: true },
  { id: 'slot_4', timeSlot: '11:00 AM - 12:00 PM', remainingSpots: 4, isAvailable: true },
  { id: 'slot_5', timeSlot: '12:00 PM - 01:00 PM', remainingSpots: 2, isAvailable: true },
  { id: 'slot_6', timeSlot: '02:00 PM - 03:00 PM', remainingSpots: 4, isAvailable: true },
  { id: 'slot_7', timeSlot: '03:00 PM - 04:00 PM', remainingSpots: 3, isAvailable: true },
  { id: 'slot_8', timeSlot: '04:00 PM - 05:00 PM', remainingSpots: 4, isAvailable: true },
  { id: 'slot_9', timeSlot: '05:00 PM - 06:00 PM', remainingSpots: 4, isAvailable: true },
  { id: 'slot_10', timeSlot: '06:00 PM - 07:00 PM', remainingSpots: 4, isAvailable: true }
];
