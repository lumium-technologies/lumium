describe("manage spaces", () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.visit("/spaces");
        cy.login();
        cy.dataCy("spaces-item").should("be.visible");
    });
    it("drawer", () => {
        cy.dataCy("spaces-item").should("be.visible");
        cy.dataCy("settings-item").should("be.visible");
    });
    it("my account button", () => {
        cy.dataCy("profile-button").should("be.visible").click();
        cy.dataCy("profile-account-button").should("be.visible").click();
        cy.dataCy("avatar-image").should("be.visible");
        cy.visit("/spaces");
    });
    afterEach(() => {
        cy.dataCy("profile-button").should("be.visible").click();
        cy.dataCy("profile-logout-button").should("be.visible").click();
        cy.dataCy("continue-button").should("be.visible");
    });
});
