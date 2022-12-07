import { AUTH, AUTH_SIGNIN } from "@routes/space";

describe("/auth", () => {
    it("redirection", () => {
        cy.visit(AUTH);
        cy.url().should('include', AUTH_SIGNIN);
    });
});