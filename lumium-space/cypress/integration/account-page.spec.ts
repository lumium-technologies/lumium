describe("account page", () => {
    beforeEach(() => {
        cy.visit("/account");
        cy.xpath("//*[@id=\"supertokens-root\"]/div/div/form/div[1]/div[2]/div/input").type(Cypress.env('TEST_USER_EMAIL'));
        cy.xpath("//*[@id=\"supertokens-root\"]/div/div/form/div[2]/div[2]/div/input").type(Cypress.env('TEST_USER_PASS'));
        cy.xpath("//*[@id=\"supertokens-root\"]/div/div/form/div[3]/button").click();
        cy.intercept("/account").as("lumium-account");
        cy.wait("@lumium-account").its("response.statusCode").should("eq", 200);
    });
    it("back to page", {
        defaultCommandTimeout: 30000,
        requestTimeout: 30000
    }, () => {
        cy.get("[data-cy=back-button]").should("be.visible").click();
        cy.url().should("contain", "/page");
        cy.visit("/account");
    });
    it("widget", {
        defaultCommandTimeout: 30000,
        requestTimeout: 30000
    }, () => {
        cy.get("[data-cy=avatar-image]").should("be.visible")
        cy.get("[data-cy=change-icon-button]").should("be.visible")
        cy.get("[data-cy=username-input]").should("be.visible")
        cy.get("[data-cy=email-input]").should("be.visible")
        cy.get("[data-cy=password-input]").should("be.visible")
        cy.get("[data-cy=cancel-button]").should("be.visible")
        cy.get("[data-cy=submit-button]").should("be.visible")
    });
    afterEach(() => {
        cy.get("[data-cy=logout-button]").should("be.visible").click();
        cy.intercept("/").as("lumium-landingpage");
        cy.wait("@lumium-landingpage").its("response.statusCode").should("eq", 200);
    });
});
