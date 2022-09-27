describe("account page", () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.visit("/account");
        cy.login();
        cy.interceptAndWait("/account", 200);
    });
    it("widget", {
        defaultCommandTimeout: 30000,
        requestTimeout: 30000
    }, () => {
        cy.dataCy("avatar-image").should("be.visible")
        cy.dataCy("change-icon-button").should("be.visible")
        cy.dataCy("username-input").should("be.visible")
        cy.dataCy("email-input").should("be.visible")
        cy.dataCy("password-input").should("be.visible")
        cy.dataCy("cancel-button").should("be.visible")
        cy.dataCy("submit-button").should("be.visible")
    });
    afterEach(() => {
        cy.dataCy("logout-button").should("be.visible").click();
        cy.interceptAndWait("/", 200);
    });
});
