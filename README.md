# Cypress E2E Testing Framework

This project contains end-to-end tests for the RH application using Cypress.

## Setup Instructions

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment**
- Copy `cypress/fixtures/config.json.example` to `cypress/fixtures/config.json`
- Update the credentials and URLs in `config.json`

3. **Run Tests**
```bash
# Open Cypress Test Runner
npm run cypress:open

# Run tests in headless mode
npm run cypress:run
```

## Project Structure
```
cypress/
├── e2e/                    # Test files
│   └── auth/              
│       └── login.cy.js     # Authentication tests
├── fixtures/               # Test data
│   └── config.json        # Configuration and credentials
├── support/               # Support files and commands
│   ├── commands.js        # Custom commands
│   ├── e2e.js            # E2E specific support code
│   └── index.d.ts        # TypeScript definitions
```

## Testing Guidelines

### 1. Writing Tests
- One test file per feature/functionality
- Use descriptive test names
- Follow the AAA pattern (Arrange, Act, Assert)
- Use custom commands for common operations
- Keep tests independent and atomic

### 2. Best Practices
- Don't hardcode credentials in test files
- Use data-testid for element selection
- Handle asynchronous operations properly
- Add appropriate waiting strategies
- Keep tests focused and concise

## Understanding the Login Flow

### API Flow Explanation
When performing login, several API calls occur in sequence:

1. **Authentication Token** (`authToken`)
```javascript
POST https://auth.stg2.rhnonprod.com/auth/realms/staging/protocol/openid-connect/token
```
- Verifies user credentials
- Returns authentication token

2. **User Session** (`userSession`)
```javascript
GET /graphql?query=query+GetUserForSession
```
- Loads user profile and preferences
- Sets up user session

3. **Cart Data** (`cartData`)
```javascript
GET /graphql?query=query+CartProjection
```
- Loads user's shopping cart
- Completes session setup

### Why We Wait for API Calls

As a QA Engineer, you might wonder why we need to wait for these API calls when manual testing works fine. Here's why:

1. **Manual vs Automated Testing**
   - Manual testing: Humans naturally wait for loading
   - Automated tests: Need explicit wait instructions

2. **Real-world Analogy**
   - Think of it like entering a store:
     1. Show ID at entrance (`authToken`)
     2. Get membership details (`userSession`)
     3. Get shopping cart ready (`cartData`)

3. **Common Issues Without Waiting**
   - Flaky tests
   - False negatives
   - Inconsistent results

### Technical Explanation for Developers

Looking at the login flow sequence:

1. **Initial Authentication Flow**:
```javascript
// After login button click, URL changes with auth params
(new url)https://stg2.rhnonprod.com/us/en#state=17590830...
// Page reloads and authentication process begins
```

2. **Sequential API Calls**:
```javascript
// 1. Authentication token request
(xhr)POST 200 https://auth.stg2.rhnonprod.com/auth/realms/staging/protocol/openid-connect/token

// 2. User session data fetch
(fetch)GET 200 /graphql?query=query+GetUserForSession

// 3. Cart and user data initialization
(fetch)GET 200 /graphql?query=query+CartProjection
```

**Why Tests Fail Without Proper Waiting**:
- UI components might still be in loading state
- User session might not be fully established
- Race conditions between API calls and UI interactions
- Page reloads and state changes during authentication flow

### Implementation Details

1. **Custom Login Command**
```javascript
Cypress.Commands.add('login', (username, password) => {
  // Set up API interceptors
  cy.intercept('POST', '**/protocol/openid-connect/token').as('authToken');
  cy.intercept('GET', '**/graphql?query=query+GetUserForSession**').as('userSession');
  cy.intercept('GET', '**/graphql?query=query+CartProjection**').as('cartData');

  // Perform login actions
  // Wait for API responses
  cy.wait(['@authToken', '@userSession', '@cartData']);
});
```

2. **Configuration Management**
```json
{
  "baseUrl": "https://stg2.rhnonprod.com/us/en",
  "credentials": {
    "validUser": {
      "username": "user@example.com",
      "password": "password123"
    }
  }
}
```

## Troubleshooting

### Common Issues
1. **Test Timing Out**
   - Increase `defaultCommandTimeout` in cypress.config.js
   - Check network conditions
   - Verify API endpoints are responding

2. **Element Not Found**
   - Check if element is in viewport
   - Verify element selectors
   - Ensure page has fully loaded

3. **API Intercept Issues**
   - Verify API endpoint patterns
   - Check network requests in Chrome DevTools
   - Ensure proper waiting strategy

## Contributing
1. Follow the existing code structure
2. Add appropriate comments
3. Update README if adding new features
4. Add test cases for new functionality

## Security Notes
- Never commit real credentials to version control
- Add `cypress/fixtures/config.json` to `.gitignore`
- Use environment variables for sensitive data 