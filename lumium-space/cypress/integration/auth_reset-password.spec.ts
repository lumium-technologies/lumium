import { AUTH_PASSWORD_RESET } from "@routes/space";

describe("/auth/reset-password", () => {
    before(() => {
        cy.signUp();
    })
    beforeEach(() => {
        cy.visit(AUTH_PASSWORD_RESET);
    });
    it("forgot password", () => {
        cy.requestReset();
        cy.dataCy("resendButton").should("be.visible");
    });
    it("resend email", () => {
        cy.requestReset();
        cy.dataCy("resendButton").should("be.visible").click();
        cy.dataCy("resendHeader").should("be.visible");
    });
});