const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://stg2.rhnonprod.com",
    defaultCommandTimeout: 10000,
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      // Environment variables can be accessed in tests using Cypress.env()
      configFile: 'config'
    }
  },
});
