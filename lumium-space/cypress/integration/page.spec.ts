import { v4 as uuidv4 } from 'uuid';

describe("page", () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.visit("/workspace/" + uuidv4());
        cy.login();
        cy.interceptAndWait("/workspace", 200);
    });
    it("pages drawer", () => {
        cy.dataCy("page-menu-button").should("be.visible").click();
        cy.dataCy("page-menu-header").should("be.visible");
        cy.dataCy("page-menu-body").should("be.visible");
        cy.dataCy("page-menu-logo").should("be.visible");
        cy.dataCy("page-menu-close").should("be.visible").click();
    });
    it("my account button", () => {
        //cy.dataCy("profile-button").should("be.visible").click();
        //cy.dataCy("profile-account-button").should("be.visible").click();
        //cy.interceptAndWait("/account", 200);
        //cy.visit("/workspace");
    });
    afterEach(() => {
        //cy.dataCy("profile-button").should("be.visible").click();
        //cy.dataCy("profile-logout-button").should("be.visible").click();
        //cy.interceptAndWait("/", 200);
    });
});
