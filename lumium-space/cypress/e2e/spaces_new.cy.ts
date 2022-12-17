import { SPACES_CREATE, SPACES_JOIN, SPACES_NEW } from "@routes/space";

describe("/spaces/new", () => {
    it("create button redirection", () => {
        cy.signUp().then(() => {
            cy.visit(SPACES_NEW);
            cy.dataCy("createButton").should("be.visible").click();
            cy.url().should('include', SPACES_CREATE);
            cy.deleteAccount();
        });
    });
    it("join button redirection", () => {
        cy.signUp().then(() => {
            cy.visit(SPACES_NEW);
            cy.dataCy("joinButton").should("be.visible").click();
            cy.url().should('include', SPACES_JOIN);
            cy.deleteAccount();
        });
    });
});
