import { ACCOUNT, AUTH_PASSWORD_RESET, AUTH_SIGNIN, AUTH_SIGNUP, SPACES_NEW } from "@routes/space";
import { makeid } from "./makeid"

declare global {
    namespace Cypress {
        interface Chainable<Subject> {
            dataCy(value: string): Chainable<Element>;
            interceptAndWait(page: string, code: number): void;
            signUp(): Chainable<[email: string, password: string]>;
            signIn(email: string, password: string): void;
            signOut(): void;
            deleteAccount(): void;
            requestReset(email: string): void;
        }
    }
}

Cypress.Commands.add("dataCy", (value: string) => {
    return cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add('interceptAndWait', (page, code) => {
    cy.intercept(`${page}`).as("wait");
    return cy.wait("@wait").its("response.statusCode").should("eq", code);
});

Cypress.Commands.add("signUp", () => {
    cy.clearCookies();
    cy.visit(AUTH_SIGNUP);
    let email = makeid() + "@example.com";
    let password = makeid();
    cy.dataCy("emailInput").should("be.visible").type(email);
    cy.dataCy("passwordInput").should("be.visible").type(password);
    cy.dataCy("passwordConfirmInput").should("be.visible").type(password);
    cy.dataCy("signUpButton").should("be.visible").click();
    cy.url().should('include', SPACES_NEW);
    cy.getCookie('sAccessToken').should("exist");
    return cy.wrap([email, password]);
});

Cypress.Commands.add("signIn", (email: string, password: string) => {
    cy.clearCookies();
    cy.visit(AUTH_SIGNIN);
    cy.dataCy("emailInput").should("be.visible").type(email);
    cy.dataCy("passwordInput").should("be.visible").type(password);
    cy.dataCy("signInButton").should("be.visible").click();
    cy.getCookie('sAccessToken').should("exist");
    cy.url().should('include', SPACES_NEW);
});

Cypress.Commands.add("signOut", () => {
    cy.visit(ACCOUNT);
    cy.dataCy("signOut").should("be.visible").click();
});

Cypress.Commands.add("deleteAccount", () => {
    cy.visit(ACCOUNT);
    cy.dataCy("deleteAccount").should("be.visible").click();
});

Cypress.Commands.add("requestReset", (email: string) => {
    cy.visit(AUTH_PASSWORD_RESET);
    cy.dataCy("emailInput").should("be.visible").type(email);
    cy.dataCy("requestResetButton").should("be.visible").click();
});

beforeEach(() => {
    cy.clearCookies();
});
