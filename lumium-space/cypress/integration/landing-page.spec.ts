import { v4 as uuidv4 } from 'uuid';

describe("landing page", () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.visit("/");
    });
    it("hero screen", () => {
        cy.dataCy("github-link").should("be.visible");
        cy.dataCy("color-theme-switcher").should("be.visible");
        cy.dataCy("continue-button").should("be.visible");
        cy.dataCy("signup-button").should("be.visible");
        cy.dataCy("lumium-color-fade").should("be.visible");
        cy.dataCy("lumium-tagline").should("be.visible");
        cy.dataCy("lumium-description").should("be.visible");
        cy.dataCy("lumium-hero-image").should("be.visible");
    });
    it("dark mode/light mode switch", () => {
        cy.get("body").should("have.class", "chakra-ui-dark");
        cy.dataCy("color-theme-switcher").click();
        cy.get("body").should("have.class", "chakra-ui-light");
        cy.dataCy("color-theme-switcher").click();
        cy.get("body").should("have.class", "chakra-ui-dark");
    });
    it("sign up button", () => {
        cy.dataCy("signup-button").should("be.visible").click();
        cy.dataCy("submitSignUpButton").should("be.visible");
    });
    it("login button", () => {
        cy.dataCy("continue-button").should("be.visible").click();
        cy.login();
        cy.interceptAndWait("/workspace", 200);
    });
    it("redirect to login from workspace", () => {
        cy.visit("/workspace/" + uuidv4());
        cy.interceptAndWait("/auth", 401);
        cy.get("#supertokens-root").should("be.visible");
        cy.login();
        cy.interceptAndWait("/workspace", 200);
    });
    it("redirect to login from account", () => {
        cy.visit("/account");
        cy.interceptAndWait("/auth", 401);
        cy.get("#supertokens-root").should("be.visible");
        cy.login();
        cy.interceptAndWait("/workspace", 200);
    });
    it("redirect to login from manage workspaces", () => {
        cy.visit("/spaces");
        cy.interceptAndWait("/auth", 401);
        cy.get("#supertokens-root").should("be.visible");
        cy.login();
        cy.interceptAndWait("/workspace", 200);
    });
});
