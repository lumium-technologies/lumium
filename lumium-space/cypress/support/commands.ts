import {v4 as uuidv4} from 'uuid';

declare namespace Cypress {
    interface Chainable {
        login(): void;
        signup(): {email: string, password: string};
        deleteAccount(): void;
        dataCy(value: string): Chainable<Element>;
        interceptAndWait(page: string, code: number): void;
    }
}

var email: string;
var password: string;
Cypress.Commands.add("login", () => {
    cy.xpath("//*[@id=\"supertokens-root\"]/div/div/form/div[1]/div[2]/div/input").should("be.visible").type(email);
    cy.xpath("//*[@id=\"supertokens-root\"]/div/div/form/div[2]/div[2]/div/input").should("be.visible").type(password);
    cy.xpath("//*[@id=\"supertokens-root\"]/div/div/form/div[3]/button").should("be.visible").click();
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
    cy.get("#supertokens-root").should("be.visible");
    email = uuidv4() + "@example.com";
    password = uuidv4();
    cy.xpath("//*[@id=\"supertokens-root\"]/div/div/form/div[1]/div[2]/div/input").type(email);
    cy.xpath("//*[@id=\"supertokens-root\"]/div/div/form/div[2]/div[2]/div/input").type(password);
    cy.xpath("//*[@id=\"supertokens-root\"]/div/div/form/div[3]/button").click();
});
Cypress.Commands.add("deleteAccount", () => {
    cy.clearCookies();
    cy.visit("/");
    cy.dataCy("continue-button").should("be.visible").click();
    cy.login();
    cy.visit("/account");
    cy.interceptAndWait("/account", 200);
    cy.dataCy("delete-button").should("be.visible").click();
    cy.intercept("/").as("logout");
    cy.wait("@logout").its("response.statusCode").should("eq", 200);
});
before(() => {
    cy.signup();
});
after(() => {
    cy.deleteAccount();
})
