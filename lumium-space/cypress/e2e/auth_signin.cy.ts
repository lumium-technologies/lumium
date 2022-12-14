import { AUTH_PASSWORD_RESET, AUTH_SIGNIN, AUTH_SIGNUP, SPACES_CREATE } from "@routes/space";
import { makeid } from "cypress/support/makeid";

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
        cy.dataCy("form").then(($form) => expect($form[0].checkValidity()).to.be.false,);
    });
    it("email required", () => {
        const password: string = makeid(50);
        cy.dataCy("emailInput").should("be.visible");
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("signInButton").should("be.visible").click();
        cy.dataCy("form").then(($form) => expect($form[0].checkValidity()).to.be.false,);
    });
    it("email validation", () => {
        const email: string = makeid(50);
        cy.dataCy("emailInput").should("be.visible").type(email);
        cy.dataCy("passwordInput").should("be.visible");
        cy.dataCy("signInButton").should("be.visible").click();
        cy.dataCy("form").then(($form) => expect($form[0].checkValidity()).to.be.false,);
    });
    it("password required", () => {
        const email: string = makeid(50) + "@example.com";
        cy.dataCy("emailInput").should("be.visible").type(email);
        cy.dataCy("passwordInput").should("be.visible");
        cy.dataCy("signInButton").should("be.visible").click();
        cy.dataCy("form").then(($form) => expect($form[0].checkValidity()).to.be.false,);
    });
    it("credentials match error", () => {
        const email: string = makeid(50) + "@example.com";
        const password: string = makeid(50);
        cy.dataCy("emailInput").should("be.visible").type(email);
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("signInButton").should("be.visible").click();
        cy.dataCy("passwordError").should("be.visible");
        cy.url().should('include', AUTH_SIGNIN);
    });
});