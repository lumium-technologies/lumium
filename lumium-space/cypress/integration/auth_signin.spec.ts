import { AUTH_PASSWORD_RESET, AUTH_SIGNIN, AUTH_SIGNUP, SPACES_CREATE } from "@routes/space";

describe("/auth/signin", () => {
    before(() => {
        cy.signUp();
    })
    beforeEach(() => {
        cy.visit(AUTH_SIGNIN);
    });
    it("sign in ", () => {
        cy.signIn();
    });
    it("forgot password", () => {
        cy.dataCy("forgotPasswordButton").should("be.visible").click();
        cy.url().should('include', AUTH_PASSWORD_RESET);
    });
    it("sign in switch to signup", () => {
        cy.dataCy("signUpSwitchButton").should("be.visible").click();
        cy.url().should('include', AUTH_SIGNUP);
    });
    it("logo direct to root", () => {
        cy.dataCy("signUpSwitchButton").should("be.visible").click();
        cy.url().should('include', AUTH_SIGNUP);
    });
});