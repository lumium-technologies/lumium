describe("page", () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.visit("/page");
        cy.login();
        cy.interceptAndWait("/page", 200);
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
        cy.dataCy("avatar-image").should("be.visible")
        cy.dataCy("change-icon-button").should("be.visible")
        cy.dataCy("cancel-button").should("be.visible")
        cy.dataCy("submit-button").should("be.visible")
        cy.visit("/page");
    });
    afterEach(() => {
        cy.dataCy("profile-button").should("be.visible").click();
        cy.dataCy("profile-logout-button").should("be.visible").click();
        cy.dataCy("continue-button").should("be.visible");
    });
});
