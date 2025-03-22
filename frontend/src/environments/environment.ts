export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000',
  stripePublicKey: 'your_stripe_public_key',
  defaultCurrency: 'USD',
  defaultLanguage: 'en',
  imageBaseUrl: 'http://localhost:5000/uploads',
  pageSize: 12,
  contactEmail: 'support@dropshipping-store.com',
  socialMedia: {
    facebook: 'https://facebook.com/dropshipping-store',
    twitter: 'https://twitter.com/dropshipping-store',
    instagram: 'https://instagram.com/dropshipping-store'
  },
  features: {
    enableRatings: true,
    enableWishlist: true,
    enableCompare: true,
    enableNewsletter: true
  }
};