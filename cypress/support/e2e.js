// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Custom command for login
Cypress.Commands.add('login', (username, password) => {
  // Set up interceptors before any actions
  cy.intercept('POST', '**/protocol/openid-connect/token').as('authToken');
  cy.intercept('GET', '**/graphql?query=query+GetUserForSession**').as('userSession');
  cy.intercept('GET', '**/graphql?query=query+CartProjection**').as('cartData');

  // Click on account icon to open login form
  cy.get('[data-testid="container-accountNavMenu_account-btn"]')
    .should('be.visible')
    .click();

  // Fill in login credentials
  cy.get('#username')
    .should('be.visible')
    .type(username);

  cy.get('#login-password')
    .should('be.visible')
    .type(password);

  // Show password (optional, but included as per reference)
  cy.get('#password-show-hide')
    .click();

  // Submit login form
  cy.get('#kc-login')
    .click();

  // Wait for all necessary API calls to complete
  cy.wait(['@authToken', '@userSession'], { timeout: 10000 });
  
  // Wait for cart data and additional session setup
  cy.wait('@cartData', { timeout: 10000 });

  // Ensure we're back on the main page
  cy.url().should('include', '/us/en');

  // Verify login was successful by checking if account menu is accessible
  cy.get('[data-testid="container-accountNavMenu_account-btn"]')
    .should('be.visible');
});

// Prevent Cypress from failing tests when it encounters uncaught exceptions in the application
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});