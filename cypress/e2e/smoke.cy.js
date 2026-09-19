describe('MoviePitch smoke test', () => {
  it('loads the input form', () => {
    cy.visit('/');

    cy.get('textarea').should('be.visible');
    cy.get('button[aria-label="Send"]').should('be.visible');
  });
});
