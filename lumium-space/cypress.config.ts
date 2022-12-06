import { defineConfig } from 'cypress'

export default defineConfig({
  video: true,
  videoCompression: false,
  viewportHeight: 1080,
  viewportWidth: 1920,
  defaultCommandTimeout: 60000,
  requestTimeout: 60000,
  retries: 3,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3000',
  },
})
