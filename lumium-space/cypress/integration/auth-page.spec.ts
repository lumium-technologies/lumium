describe("auth page", () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.visit("/");
    });
    it("redirect to login from page", () => {
        cy.visit("/page");
        cy.interceptAndWait("/auth", 401);
        cy.dataCy("submitSignInButton").should("be.visible");
        cy.login();
        cy.interceptAndWait("/page", 200);
    });
    it("redirect to login from account", () => {
        cy.visit("/account");
        cy.interceptAndWait("/auth", 401);
        cy.dataCy("submitSignInButton").should("be.visible");
        cy.login();
        cy.interceptAndWait("/page", 200);
    });
    it("redirect to login from manage workspaces", () => {
        cy.visit("/space-manager");
        cy.interceptAndWait("/auth", 401);
        cy.dataCy("submitSignInButton").should("be.visible");
        cy.login();
        cy.interceptAndWait("/page", 200);
    });
});
