describe("account page", () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.visit("/space-manager");
        cy.login();
        cy.interceptAndWait("/space-manager", 200);
    });
    it("drawer", () => {
        cy.dataCy("spaces-item").should("be.visible");
        cy.dataCy("settings-item").should("be.visible");
    });
    it("my account button", () => {
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
