import { SPACES_CREATE, SPACES_OVERVIEW } from "@routes/space";

describe("/spaces/overview", () => {
    it("create button redirection", () => {
        cy.signUp().then(() => {
            cy.visit(SPACES_OVERVIEW);
            cy.dataCy("createButton").should("be.visible").click();
            cy.url().should('include', SPACES_CREATE);
            cy.deleteAccount();
        });
    });
});
