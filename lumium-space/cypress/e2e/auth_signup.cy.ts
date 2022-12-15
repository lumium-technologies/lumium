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
    it("email validation", () => {
        const email: string = makeid(50);
        const password: string = makeid(50);
        cy.dataCy("emailInput").should("be.visible").type(email);
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("passwordConfirmInput").should("be.visible").type(password);
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("form").then(($form) => expect($form[0].checkValidity()).to.be.false,)
    });
    it("email required", () => {
        const password: string = makeid(50);
        cy.dataCy("emailInput").should("be.visible");
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("passwordConfirmInput").should("be.visible").type(password);
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("form").then(($form) => expect($form[0].checkValidity()).to.be.false,)
    });
    it("password required", () => {
        const email: string = makeid(50) + "@example.com";
        const password: string = makeid(50);
        cy.dataCy("emailInput").should("be.visible").type(email);
        cy.dataCy("passwordInput").should("be.visible");
        cy.dataCy("passwordConfirmInput").should("be.visible").type(password);
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("form").then(($form) => expect($form[0].checkValidity()).to.be.false,)
    });
    it("password confirm required", () => {
        const email: string = makeid(50) + "@example.com";
        const password: string = makeid(50);
        cy.dataCy("emailInput").should("be.visible").type(email);
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("passwordConfirmInput").should("be.visible");
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("form").then(($form) => expect($form[0].checkValidity()).to.be.false,)
    });
    it("password match error", () => {
        const email: string = makeid(50) + "@example.com";
        const password: string = makeid(50);
        const passwordConfirm: string = makeid(50);
        cy.dataCy("emailInput").should("be.visible").type(email);
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("passwordConfirmInput").should("be.visible").type(passwordConfirm);
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("passwordMatchError").should("be.visible");
        cy.url().should('include', AUTH_SIGNUP);
    });
});