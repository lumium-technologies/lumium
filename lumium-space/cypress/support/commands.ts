import { AUTH_SIGNIN, AUTH_SIGNUP, SPACES_NEW } from "@routes/space";
import { makeid } from "./makeid"
declare global {
    namespace Cypress {
        interface Chainable {
            dataCy(value: string): Chainable<Element>;
            interceptAndWait(page: string, code: number): void;
            signUp(): { email: string, password: string };
            signIn(): void;
            requestReset(): void;
        }
    }
}
var email: string;
var password: string;
Cypress.Commands.add('dataCy', (value) => {
    return cy.get(`[data-cy=${value}]`);
});
Cypress.Commands.add('interceptAndWait', (page, code) => {
    cy.intercept(`${page}`).as("wait");
    cy.wait("@wait").its("response.statusCode").should("eq", code);
});
Cypress.Commands.add("signUp", () => {
    cy.visit(AUTH_SIGNUP);
    email = makeid(50) + "@example.com";
    password = makeid(50);
    cy.dataCy("emailInput").should("be.visible").type(email);
    cy.dataCy("passwordInput").should("be.visible").type(password);
    cy.dataCy("passwordVerifyInput").should("be.visible").type(password);
    cy.dataCy("signUpButton").should("be.visible").click();
    cy.url().should('include', SPACES_NEW);
});
Cypress.Commands.add("signIn", () => {
    cy.visit(AUTH_SIGNIN);
    cy.dataCy("emailInput").should("be.visible").type(email);
    cy.dataCy("passwordInput").should("be.visible").type(password);
    cy.dataCy("signInButton").should("be.visible").click();
    cy.url().should('include', SPACES_NEW);
});
Cypress.Commands.add("requestReset", () => {
    cy.dataCy("emailInput").should("be.visible").type(email);
    cy.dataCy("requestResetButton").should("be.visible").click().click();
    cy.dataCy("resendButton").should("be.visible");
});
beforeEach(() => {
    cy.clearCookies();
});