declare namespace Cypress {
  interface Chainable {
    login(): void;
    dataCy(value: string): Chainable<Element>;
    intnwait(page: string, code: number): void;
  }
}
Cypress.Commands.add("login", () => {
  cy.xpath("//*[@id=\"supertokens-root\"]/div/div/form/div[1]/div[2]/div/input").type(Cypress.env('TEST_USER_EMAIL'));
  cy.xpath("//*[@id=\"supertokens-root\"]/div/div/form/div[2]/div[2]/div/input").type(Cypress.env('TEST_USER_PASS'));
  cy.xpath("//*[@id=\"supertokens-root\"]/div/div/form/div[3]/button").click();
});
Cypress.Commands.add('dataCy', (value) => {
  return cy.get(`[data-cy=${value}]`)
})
Cypress.Commands.add('intnwait', (page, code) => {
  cy.intercept(`${page}`).as("wait");
  cy.wait("@wait").its("response.statusCode").should("eq", code);
})