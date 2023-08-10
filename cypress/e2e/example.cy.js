// https://on.cypress.io/api

describe('Sanity Test', () => {
  it('visits the app root url', () => {
    //this function will tel the function to viist a page
    cy.visit('/')
    cy.contains('#header a:first-child', 'Music')
  })
})
