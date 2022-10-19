describe("account page", () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.visit("/account");
        cy.login();
        cy.interceptAndWait("/account", 200);
    });
    it("widget", () => {
        cy.dataCy("avatar-image").should("be.visible")
        cy.dataCy("change-icon-button").should("be.visible")
        cy.dataCy("cancel-button").should("be.visible")
        cy.dataCy("submit-button").should("be.visible")
    });

});
