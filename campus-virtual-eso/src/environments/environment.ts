export const environment = {
  production: false,
  apiUrl: 'https://api.campus-virtual.edu',
  appName: 'Campus Virtual ESO',
  version: '1.0.0',
  features: {
    enableMockData: true,
    enableAnalytics: false,
    enableDebugMode: true
  },
  cache: {
    defaultTtl: 300000, // 5 minutes in milliseconds
    maxSize: 100 // maximum number of cached items
  },
  api: {
    timeout: 30000, // 30 seconds
    retryAttempts: 2,
    retryDelay: 1000 // 1 second
  }
};