import { AUTH_SIGNUP, AUTH_SIGNIN } from "@routes/space";

describe("/auth/signup", () => {
    beforeEach(() => {
        cy.visit(AUTH_SIGNUP);
    });
    it("sign up", () => {
        cy.signUp();
    });
    it("sign up switch to sign in", () => {
        cy.dataCy("signInSwitchButton").should("be.visible").click();
        cy.url().should('include', AUTH_SIGNIN);
    });
});