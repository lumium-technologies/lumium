import { AUTH_SIGNUP, AUTH_SIGNIN } from "@routes/space";
import { makeid } from "cypress/support/makeid";

describe("/auth/signup", () => {
    it("sign up", () => {
        cy.signUp().then(() => cy.deleteAccount());
    });
    it("sign up switch to sign in", () => {
        cy.visit(AUTH_SIGNUP);
        cy.dataCy("signInSwitchButton").should("be.visible").click();
        cy.url().should('include', AUTH_SIGNIN);
    });
    it("email validation", () => {
        cy.visit(AUTH_SIGNUP);
        const email: string = makeid();
        const password: string = makeid();
        cy.dataCy("emailInput").should("be.visible").type(email);
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("passwordConfirmInput").should("be.visible").type(password);
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("form").then(($form) => expect($form[0].checkValidity()).to.be.false,)
    });
    it("email required", () => {
        cy.visit(AUTH_SIGNUP);
        const password: string = makeid();
        cy.dataCy("emailInput").should("be.visible");
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("passwordConfirmInput").should("be.visible").type(password);
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("form").then(($form) => expect($form[0].checkValidity()).to.be.false,)
    });
    it("password required", () => {
        cy.visit(AUTH_SIGNUP);
        const email: string = makeid() + "@example.com";
        const password: string = makeid();
        cy.dataCy("emailInput").should("be.visible").type(email);
        cy.dataCy("passwordInput").should("be.visible");
        cy.dataCy("passwordConfirmInput").should("be.visible").type(password);
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("form").then(($form) => expect($form[0].checkValidity()).to.be.false,)
    });
    it("password confirm required", () => {
        cy.visit(AUTH_SIGNUP);
        const email: string = makeid() + "@example.com";
        const password: string = makeid();
        cy.dataCy("emailInput").should("be.visible").type(email);
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("passwordConfirmInput").should("be.visible");
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("form").then(($form) => expect($form[0].checkValidity()).to.be.false,)
    });
    it("password match error", () => {
        cy.visit(AUTH_SIGNUP);
        const email: string = makeid() + "@example.com";
        const password: string = makeid();
        const passwordConfirm: string = makeid();
        cy.dataCy("emailInput").should("be.visible").type(email);
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("passwordConfirmInput").should("be.visible").type(passwordConfirm);
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.dataCy("signUpError").should("be.visible");
        cy.url().should('include', AUTH_SIGNUP);
    });
});
