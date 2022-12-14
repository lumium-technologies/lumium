import { SPACES_JOIN } from "@routes/space";

describe("/spaces/new", () => {
    before(() => {
        cy.signUp();
    });
    beforeEach(() => {
        cy.signIn();
        cy.visit(SPACES_JOIN);
    });
    it("page visible", () => {
        cy.dataCy("button").should("be.visible");
    })
});