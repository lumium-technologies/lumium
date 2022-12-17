import { AUTH_SIGNIN, ACCOUNT, SPACES_NEW, SPACES_CREATE, SPACES_JOIN } from "@routes/space";

describe("redirection", () => {
    it("redirect /account", () => {
        cy.visit(ACCOUNT);
        cy.url().should('include', AUTH_SIGNIN);
    });
    it("redirect /spaces/new", () => {
        cy.visit(SPACES_NEW);
        cy.url().should('include', AUTH_SIGNIN);
    });
    it("redirect /spaces/create", () => {
        cy.visit(SPACES_CREATE);
        cy.url().should('include', AUTH_SIGNIN);
    });
    it("redirect /spaces/join", () => {
        cy.visit(SPACES_JOIN);
        cy.url().should('include', AUTH_SIGNIN);
    });
});
