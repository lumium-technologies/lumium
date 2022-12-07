import { AUTH_PASSWORD_RESET } from "@routes/space";
import { makeid } from "cypress/support/makeid";

describe("/auth/reset-password", () => {
    before(() => {
        cy.signUp();
    })
    beforeEach(() => {
        cy.visit(AUTH_PASSWORD_RESET);
    });
    it("forgot password", () => {
        cy.requestReset();
        cy.dataCy("emailSentHeader").should("be.visible");
    });
    it("email error required", () => {
        cy.dataCy("emailInput").should("be.visible");
        cy.dataCy("requestResetButton").should("be.visible").click();
        cy.dataCy("emailError").should("be.visible");
    });
    it("email error required remove after typing email", () => {
        const email = makeid(50) + "@example.com";
        cy.dataCy("emailInput").should("be.visible");
        cy.dataCy("requestResetButton").should("be.visible").click();
        cy.dataCy("emailError").should("be.visible");
        cy.dataCy("emailInput").should("be.visible").type(email);
        cy.dataCy("requestResetButton").should("be.visible").click();
        cy.dataCy("emailError").should("not.exist");
    });
    it("email doesn't exist error", () => {
        const email = makeid(50) + "@example.com";
        cy.dataCy("emailInput").should("be.visible").type(email);
        cy.dataCy("requestResetButton").should("be.visible").click();
        cy.dataCy("emailExistError").should("be.visible");
    });
});