import { AUTH_SIGNUP, AUTH_SIGNIN } from "@routes/space";
import { makeid } from "cypress/support/makeid";

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
    it("email required error", () => {
        cy.dataCy("emailInput").should("be.visible");
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("emailError").should("be.visible");
        cy.url().should('include', AUTH_SIGNUP);
    });
    it("email required error with typed password", () => {
        const password: string = makeid(50);
        cy.dataCy("emailInput").should("be.visible");
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("emailError").should("be.visible");
        cy.url().should('include', AUTH_SIGNUP);
    });
    it("email required error with typed password verify", () => {
        const password: string = makeid(50);
        cy.dataCy("emailInput").should("be.visible");
        cy.dataCy("passwordVerifyInput").should("be.visible").type(password);
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("emailError").should("be.visible");
        cy.url().should('include', AUTH_SIGNUP);
    });
    it("email required error with typed password and typed password verify", () => {
        const password: string = makeid(50);
        cy.dataCy("emailInput").should("be.visible");
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("passwordVerifyInput").should("be.visible").type(password);
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("emailError").should("be.visible");
        cy.url().should('include', AUTH_SIGNUP);
    });
    it("password required error", () => {
        cy.dataCy("passwordInput").should("be.visible");
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("passwordError").should("be.visible");
        cy.url().should('include', AUTH_SIGNUP);
    });
    it("password required error with typed email", () => {
        const email: string = makeid(50) + "@example.com";
        cy.dataCy("emailInput").should("be.visible").type(email);
        cy.dataCy("passwordInput").should("be.visible");
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("passwordError").should("be.visible");
        cy.url().should('include', AUTH_SIGNUP);
    });
    it("password required error with typed password verify", () => {
        const password: string = makeid(50);
        cy.dataCy("passwordInput").should("be.visible");
        cy.dataCy("passwordVerifyInput").should("be.visible").type(password);
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("passwordError").should("be.visible");
        cy.url().should('include', AUTH_SIGNUP);
    });
    it("password required error with typed email and typed password verify", () => {
        const email: string = makeid(50) + "@example.com";
        const password: string = makeid(50);
        cy.dataCy("emailInput").should("be.visible").type(email);
        cy.dataCy("passwordInput").should("be.visible");
        cy.dataCy("passwordVerifyInput").should("be.visible").type(password);
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("passwordError").should("be.visible");
        cy.url().should('include', AUTH_SIGNUP);
    });
    it("password match error", () => {
        const password: string = makeid(50);
        const passwordVerify: string = makeid(50);
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("passwordVerifyInput").should("be.visible").type(passwordVerify);
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("passwordMatchError").should("be.visible");
        cy.url().should('include', AUTH_SIGNUP);
    });
    it("password match error with typed email", () => {
        const email: string = makeid(50) + "@example.com";
        const password: string = makeid(50);
        const passwordVerify: string = makeid(50);
        cy.dataCy("emailInput").should("be.visible").type(email);
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("passwordVerifyInput").should("be.visible").type(passwordVerify);
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("passwordMatchError").should("be.visible");
        cy.url().should('include', AUTH_SIGNUP);
    });
    it("show all errors if only password verify typed", () => {
        const password: string = makeid(50);
        cy.dataCy("emailInput").should("be.visible");
        cy.dataCy("passwordInput").should("be.visible");
        cy.dataCy("passwordVerifyInput").should("be.visible").type(password);
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("emailError").should("be.visible");
        cy.dataCy("passwordError").should("be.visible");
        cy.dataCy("passwordMatchError").should("be.visible");
        cy.url().should('include', AUTH_SIGNUP);
    });
    it("email required error remove after typing email", () => {
        const email: string = makeid(50) + "@example.com";
        cy.dataCy("emailInput").should("be.visible");
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("emailError").should("be.visible");
        cy.dataCy("emailInput").should("be.visible").type(email);
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("emailError").should("not.exist");
        cy.url().should('include', AUTH_SIGNUP);
    });
    it("password required error remove after typing password", () => {
        const password: string = makeid(50);
        cy.dataCy("passwordInput").should("be.visible");
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("passwordError").should("be.visible");
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("passwordError").should("not.exist");
        cy.url().should('include', AUTH_SIGNUP);
    });
    it("password match error remove after typing password and password verify", () => {
        const password: string = makeid(50);
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("passwordVerifyInput").should("be.visible");
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("passwordMatchError").should("be.visible");
        cy.dataCy("passwordVerifyInput").should("be.visible").type(password);
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("passwordMatchError").should("not.exist");
        cy.url().should('include', AUTH_SIGNUP);
    });
});