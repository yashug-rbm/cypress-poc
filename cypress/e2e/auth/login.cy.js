describe('Authentication', () => {
  let config;

  before(() => {
    cy.fixture('config').then((configData) => {
      config = configData;
    });
  });

  beforeEach(() => {
    // Clear cookies and localStorage before each test
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/us/en');
  });

  it('should successfully log in with valid credentials', () => {
    const { username, password } = config.credentials.validUser;
    
    // Use the custom login command
    cy.login(username, password);

    // After successful login, verify profile access
    cy.get('[data-testid="container-accountNavMenu_account-btn"]')
      .should('be.visible')
      .click();

    // Verify successful login by checking profile link
    cy.get('[data-testid="navigation-account-item-id-my-account/profile.jsp"]')
      .should('be.visible')
      .click();

    // Additional verification that we're on the profile page
    cy.url().should('include', '/my-account/profile');
  });

  it('should display error message with invalid credentials', () => {
    const { username, password } = config.credentials.invalidUser;

    // Intercept the authentication endpoint
    cy.intercept('POST', '**/login-actions/authenticate**').as('loginAttempt');
    
    // Click on account icon to open login form
    cy.get('[data-testid="container-accountNavMenu_account-btn"]')
      .should('be.visible')
      .click();

    // Fill in invalid credentials
    cy.get('#username')
      .should('be.visible')
      .type(username);

    cy.get('#login-password')
      .should('be.visible')
      .type(password);

    // Submit login form
    cy.get('#kc-login')
      .click();

    // Wait for the authentication attempt and verify we're on the login page
    cy.wait('@loginAttempt', { timeout: 10000 });
    cy.url().should('include', '/auth/realms/staging/login-actions/authenticate');

    // Verify error message appears
    cy.get('.alert-error')
      .should('be.visible')
      .and('contain', 'Invalid email address or password.');
  });

  it('should show validation errors for empty fields', () => {
    // Click on account icon to open login form
    cy.get('[data-testid="container-accountNavMenu_account-btn"]')
      .should('be.visible')
      .click();

    // Submit form without entering any credentials
    cy.get('#kc-login').click();

    // Verify error message appears
    cy.get('.alert-error')
      .should('be.visible')
      .and('contain', 'Invalid email address or password.');
  });
}); 