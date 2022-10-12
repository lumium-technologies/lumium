import { v4 as uuidv4 } from 'uuid';

describe("page", () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.visit("/auth/signin");
        cy.login();
        cy.interceptAndWait("/spaces/new", 200);
        cy.visit("/workspace");
    });
    it("pages drawer", () => {
        cy.dataCy("page-menu-button").should("be.visible").click();
        cy.dataCy("page-menu-header").should("be.visible");
        cy.dataCy("page-menu-body").should("be.visible");
        cy.dataCy("page-menu-logo").should("be.visible");
        cy.dataCy("page-menu-close").should("be.visible").click();
    });
    it("my account button", () => {
        cy.dataCy("profile-button").should("be.visible").click();
        cy.dataCy("profile-account-button").should("be.visible").click();
        cy.dataCy("avatar-image").should("be.visible");
        cy.visit("/workspace");
    });
    afterEach(() => {
        /*cy.dataCy("profile-button").should("be.visible").click();
        cy.dataCy("profile-logout-button").should("be.visible").click();
        cy.interceptAndWait("/", 200);*/
    });
});
