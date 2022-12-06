import { AUTH_PASSWORD_RESET, AUTH_SIGNIN, AUTH_SIGNUP, SPACES_CREATE } from "@routes/space";
import { makeid } from "cypress/support";

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
    it("email and password required error", () => {
        cy.dataCy("emailInput").should("be.visible");
        cy.dataCy("passwordInput").should("be.visible");
        cy.dataCy("signInButton").should("be.visible").click();
        cy.dataCy("emailError").should("be.visible");
        cy.dataCy("passwordError").should("be.visible");
        cy.url().should('include', AUTH_SIGNIN);
    });
    it("email required error", () => {
        cy.dataCy("emailInput").should("be.visible");
        cy.dataCy("signInButton").should("be.visible").click();
        cy.dataCy("emailError").should("be.visible");
        cy.url().should('include', AUTH_SIGNIN);
    });
    it("email required error with typed password", () => {
        const password: string = makeid(50);
        cy.dataCy("emailInput").should("be.visible");
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("signInButton").should("be.visible").click();
        cy.dataCy("emailError").should("be.visible");
        cy.url().should('include', AUTH_SIGNIN);
    });
    it("password required error", () => {
        cy.dataCy("passwordInput").should("be.visible");
        cy.dataCy("signInButton").should("be.visible").click();
        cy.dataCy("passwordError").should("be.visible");
        cy.url().should('include', AUTH_SIGNIN);
    });
    it("password required error with typed email", () => {
        const email: string = makeid(50) + "@example.com";
        cy.dataCy("emailInput").should("be.visible").type(email);
        cy.dataCy("passwordInput").should("be.visible");
        cy.dataCy("signInButton").should("be.visible").click();
        cy.dataCy("passwordError").should("be.visible");
        cy.url().should('include', AUTH_SIGNIN);
    });
    it("credentials match error", () => {
        const email: string = makeid(50) + "@example.com";
        const password: string = makeid(50);
        cy.dataCy("emailInput").should("be.visible").type(email);
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("signInButton").should("be.visible").click();
        cy.dataCy("credentialsMatchError").should("be.visible");
        cy.url().should('include', AUTH_SIGNIN);
    });
    it("email required error remove after typing email", () => {
        const email: string = makeid(50) + "@example.com";
        cy.dataCy("emailInput").should("be.visible");
        cy.dataCy("signInButton").should("be.visible").click();
        cy.dataCy("emailError").should("be.visible");
        cy.dataCy("emailInput").should("be.visible").type(email);
        cy.dataCy("signInButton").should("be.visible").click();
        cy.dataCy("emailError").should("not.exist");
        cy.url().should('include', AUTH_SIGNIN);
    });
    it("password required error remove after typing email", () => {
        const password: string = makeid(50);
        cy.dataCy("passwordInput").should("be.visible");
        cy.dataCy("signInButton").should("be.visible").click();
        cy.dataCy("passwordError").should("be.visible");
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("signInButton").should("be.visible").click();
        cy.dataCy("passwordError").should("not.exist");
        cy.url().should('include', AUTH_SIGNIN);
    });
    it("credentials match required error remove after removing email", () => {
        const email: string = makeid(50) + "@example.com";
        const password: string = makeid(50);
        cy.dataCy("emailInput").should("be.visible").type(email);
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("signInButton").should("be.visible").click();
        cy.dataCy("credentialsMatchError").should("be.visible");
        cy.dataCy("emailInput").should("be.visible").clear();
        cy.dataCy("signInButton").should("be.visible").click();
        cy.dataCy("credentialsMatchError").should("not.exist");
        cy.dataCy("emailError").should("be.visible");
        cy.url().should('include', AUTH_SIGNIN);
    });
    it("credentials match required error remove after removing password", () => {
        const email: string = makeid(50) + "@example.com";
        const password: string = makeid(50);
        cy.dataCy("emailInput").should("be.visible").type(email);
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("signInButton").should("be.visible").click();
        cy.dataCy("credentialsMatchError").should("be.visible");
        cy.dataCy("passwordInput").should("be.visible").clear();
        cy.dataCy("signInButton").should("be.visible").click();
        cy.dataCy("credentialsMatchError").should("not.exist");
        cy.dataCy("passwordError").should("be.visible");
        cy.url().should('include', AUTH_SIGNIN);
    });
});