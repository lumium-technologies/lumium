import { AUTH_PASSWORD_RESET, AUTH_SIGNIN, AUTH_SIGNUP } from "@routes/space";
import { makeid } from "cypress/support/makeid";

describe("/auth/signin", () => {
    it("sign in", () => {
        cy.signUp().then(([email, password]) => {
            cy.signOut();
            cy.signIn(email, password);
            cy.deleteAccount();
        });
    });
    it("forgot password", () => {
        cy.visit(AUTH_SIGNIN);
        cy.dataCy("forgotPasswordButton").should("be.visible").click();
        cy.url().should('include', AUTH_PASSWORD_RESET);
    });
    it("sign in switch to signup", () => {
        cy.visit(AUTH_SIGNIN);
        cy.dataCy("signUpSwitchButton").should("be.visible").click();
        cy.url().should('include', AUTH_SIGNUP);
    });
    it("logo direct to root", () => {
        cy.visit(AUTH_SIGNIN);
        cy.dataCy("signUpSwitchButton").should("be.visible").click();
        cy.url().should('include', AUTH_SIGNUP);
    });
    it("email and password required error", () => {
        cy.visit(AUTH_SIGNIN);
        cy.dataCy("emailInput").should("be.visible");
        cy.dataCy("passwordInput").should("be.visible");
        cy.dataCy("signInButton").should("be.visible").click();
        cy.dataCy("form").then(($form) => expect($form[0].checkValidity()).to.be.false,);
    });
    it("email required", () => {
        cy.visit(AUTH_SIGNIN);
        const password: string = makeid();
        cy.dataCy("emailInput").should("be.visible");
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("signInButton").should("be.visible").click();
        cy.dataCy("form").then(($form) => expect($form[0].checkValidity()).to.be.false,);
    });
    it("email validation", () => {
        cy.visit(AUTH_SIGNIN);
        const email: string = makeid();
        cy.dataCy("emailInput").should("be.visible").type(email);
        cy.dataCy("passwordInput").should("be.visible");
        cy.dataCy("signInButton").should("be.visible").click();
        cy.dataCy("form").then(($form) => expect($form[0].checkValidity()).to.be.false,);
    });
    it("password required", () => {
        cy.visit(AUTH_SIGNIN);
        const email: string = makeid() + "@example.com";
        cy.dataCy("emailInput").should("be.visible").type(email);
        cy.dataCy("passwordInput").should("be.visible");
        cy.dataCy("signInButton").should("be.visible").click();
        cy.dataCy("form").then(($form) => expect($form[0].checkValidity()).to.be.false,);
    });
    it("credentials match error", () => {
        cy.visit(AUTH_SIGNIN);
        const email: string = makeid() + "@example.com";
        const password: string = makeid();
        cy.dataCy("emailInput").should("be.visible").type(email);
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("signInButton").should("be.visible").click();
        cy.dataCy("signInError").should("be.visible");
        cy.url().should('include', AUTH_SIGNIN);
    });
});
