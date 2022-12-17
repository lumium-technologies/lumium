import { SPACES_JOIN } from "@routes/space";

describe("/spaces/new", () => {
    it("page visible", () => {
        cy.signUp().then(() => {
            cy.visit(SPACES_JOIN);
            cy.dataCy("button").should("be.visible");
            cy.deleteAccount();
        });
    })
});
