/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login with username and password
     * @example cy.login('user@email.com', 'password123')
     */
    login(username: string, password: string): Chainable<void>
  }
} 