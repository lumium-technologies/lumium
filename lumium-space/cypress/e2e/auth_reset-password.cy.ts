import { AUTH_PASSWORD_RESET } from "@routes/space";
import { makeid } from "cypress/support/makeid";

describe("/auth/reset-password", () => {
    it("forgot password", () => {
        cy.signUp().then(([email]) => {
            cy.requestReset(email);
            cy.dataCy("emailSentHeader").should("be.visible");
            cy.deleteAccount();
        });
    });
    it("email error required", () => {
        cy.visit(AUTH_PASSWORD_RESET);
        cy.dataCy("emailInput").should("be.visible");
        cy.dataCy("requestResetButton").should("be.visible").click();
        cy.dataCy("form").then(($form) => expect($form[0].checkValidity()).to.be.false);
    });
    it("email doesn't exist error", () => {
        cy.visit(AUTH_PASSWORD_RESET);
        const email = makeid() + "@example.com";
        cy.dataCy("emailInput").should("be.visible").type(email);
        cy.dataCy("requestResetButton").should("be.visible").click();
        cy.dataCy("emailError").should("be.visible");
    });
});
