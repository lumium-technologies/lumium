declare namespace Cypress {
    interface Chainable {
        login(): void;
        signup(): { email: string, password: string };
        deleteAccount(): void;
        dataCy(value: string): Chainable<Element>;
        interceptAndWait(page: string, code: number): void;
    }
}
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
var email: string;
var password: string;
Cypress.Commands.add("login", () => {
    cy.dataCy("signInEmailInput").should("be.visible").type(email);
    cy.dataCy("signInPasswordInput").should("be.visible").type(password);
    cy.dataCy("submitSignInButton").should("be.visible").click();
});
Cypress.Commands.add('dataCy', (value) => {
    return cy.get(`[data-cy=${value}]`);
});
Cypress.Commands.add('interceptAndWait', (page, code) => {
    cy.intercept(`${page}`).as("wait");
    cy.wait("@wait").its("response.statusCode").should("eq", code);
});
Cypress.Commands.add("signup", () => {
    cy.visit("/");
    cy.dataCy("signup-button").should("be.visible").click();
    email = makeid(50) + "@example.com";
    password = makeid(50);
    cy.dataCy("signUpEmailInput").should("be.visible").type(email);
    cy.dataCy("signUpPasswordInput").should("be.visible").type(password);
    cy.dataCy("submitSignUpButton").should("be.visible").click();
    cy.interceptAndWait("/page", 200);
});
Cypress.Commands.add("deleteAccount", () => {
    cy.clearCookies();
    cy.visit("/account");
    cy.login();
    cy.dataCy("delete-button").should("be.visible").click();
    cy.dataCy("continue-button").should("be.visible");
});
before(() => {
    cy.signup();
});
after(() => {
    cy.deleteAccount();
});

