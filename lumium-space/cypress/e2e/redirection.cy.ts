import { AUTH_SIGNIN, ACCOUNT, SPACES_OVERVIEW, SPACES_CREATE } from "@routes/space";

describe("redirection", () => {
    it("redirect /account", () => {
        cy.visit(ACCOUNT);
        cy.url().should('include', AUTH_SIGNIN);
    });
    it("redirect /spaces/overview", () => {
        cy.visit(SPACES_OVERVIEW);
        cy.url().should('include', AUTH_SIGNIN);
    });
    it("redirect /spaces/create", () => {
        cy.visit(SPACES_CREATE);
        cy.url().should('include', AUTH_SIGNIN);
    });
});
