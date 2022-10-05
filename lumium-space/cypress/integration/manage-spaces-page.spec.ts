describe("manage spaces", () => {
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
        cy.dataCy("avatar-image").should("be.visible")
        cy.dataCy("change-icon-button").should("be.visible")
        cy.dataCy("cancel-button").should("be.visible")
        cy.dataCy("submit-button").should("be.visible")
        cy.visit("/space-manager");
    });
    afterEach(() => {
        cy.dataCy("profile-button").should("be.visible").click();
        cy.dataCy("profile-logout-button").should("be.visible").click();
        cy.dataCy("continue-button").should("be.visible");
    });
});
