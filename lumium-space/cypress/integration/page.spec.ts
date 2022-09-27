describe("page", () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.visit("/page");
        cy.login();
        cy.interceptAndWait("/page", 200);
    });
    it("pages drawer", {
        defaultCommandTimeout: 30000,
        requestTimeout: 30000
    }, () => {
        cy.dataCy("page-menu-button").should("be.visible").click();
        cy.dataCy("page-menu-header").should("be.visible");
        cy.dataCy("page-menu-body").should("be.visible");
        cy.dataCy("page-menu-logo").should("be.visible");
        cy.dataCy("page-menu-close").should("be.visible").click();
    });
    it("my account button", {
        defaultCommandTimeout: 30000,
        requestTimeout: 30000
    }, () => {
        cy.dataCy("profile-button").should("be.visible").click();
        cy.dataCy("profile-account-button").should("be.visible").click();
        cy.interceptAndWait("/account", 200);
        cy.visit("/page");
    });
    afterEach(() => {
        cy.dataCy("profile-button").should("be.visible").click();
        cy.dataCy("profile-logout-button").should("be.visible").click().click();
        cy.interceptAndWait("/", 200);
    });
});
