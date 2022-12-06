import { AUTH_PASSWORD_RESET } from "@routes/space";

describe("/auth/reset-password", () => {
    before(() => {
        cy.signUp();
    })
    beforeEach(() => {
        cy.visit(AUTH_PASSWORD_RESET);
    });
    it("forgot password", () => {
        cy.dataCy("forgotPasswordButton").should("be.visible").click();
        cy.url().should('include', AUTH_PASSWORD_RESET);
    });
});