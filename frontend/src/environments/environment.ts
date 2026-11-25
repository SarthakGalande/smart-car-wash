export const environment = {
  production: false,
  apiUrl: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || '/api',
  taxRatePercent: 18,
  companyName: 'Smart Car Wash',
  supportPhone: '+91 98765 43210',
  supportEmail: 'support@smartcarwash.com'
};
