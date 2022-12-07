import { SPACES_CREATE, SPACES_JOIN, SPACES_NEW } from "@routes/space";

describe("/spaces/new", () => {
    before(() => {
        cy.signUp();
    });
    beforeEach(() => {
        cy.signIn();
        cy.visit(SPACES_NEW);
    });
    it("create button redirection", () => {
        cy.dataCy("createButton").should("be.visible").click();
        cy.url().should('include', SPACES_CREATE);
    });
    it("join button redirection", () => {
        cy.dataCy("joinButton").should("be.visible").click();
        cy.url().should('include', SPACES_JOIN);
    });
});