describe("auth page", () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.visit("/");
    });
    it("redirect to login from page", () => {
        cy.visit("/page");
        cy.dataCy("submitSignInButton").should("be.visible");
        cy.login();
        cy.interceptAndWait("/page", 200);
    });
    it("redirect to login from account", () => {
        cy.visit("/account");
        cy.dataCy("submitSignInButton").should("be.visible");
        cy.login();
        cy.dataCy("avatar-image").should("be.visible");
    });
    it("redirect to login from manage workspaces", () => {
        cy.visit("/space-manager");
        cy.dataCy("submitSignInButton").should("be.visible");
        cy.login();
        cy.dataCy("spaces-item").should("be.visible");
    });
});
