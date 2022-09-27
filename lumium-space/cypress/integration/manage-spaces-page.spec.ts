describe("account page", () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.visit("/space-manager");
        cy.login();
        cy.interceptAndWait("/space-manager", 200);
    });
    it("my account button", {
        defaultCommandTimeout: 30000,
        requestTimeout: 30000
    }, () => {
        cy.dataCy("profile-button").should("be.visible").click();
        cy.dataCy("profile-account-button").should("be.visible").click();
        cy.interceptAndWait("/account", 200);
        cy.visit("/space-manager");
    });
    afterEach(() => {
        cy.dataCy("profile-button").should("be.visible").click();
        cy.dataCy("profile-logout-button").should("be.visible").click().click();
        cy.interceptAndWait("/", 200);
    });
});
