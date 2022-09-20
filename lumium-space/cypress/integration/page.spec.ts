describe("page", () => {
    beforeEach(() => {
        cy.visit("/page");
        cy.xpath("//*[@id=\"supertokens-root\"]/div/div/form/div[1]/div[2]/div/input").type(Cypress.env('TEST_USER_EMAIL'));
        cy.xpath("//*[@id=\"supertokens-root\"]/div/div/form/div[2]/div[2]/div/input").type(Cypress.env('TEST_USER_PASS'));
        cy.xpath("//*[@id=\"supertokens-root\"]/div/div/form/div[3]/button").click();
        cy.intercept("/page").as("lumium-workspace");
        cy.wait("@lumium-workspace").its("response.statusCode").should("eq", 200);
    });
    it("pages drawer", {
        defaultCommandTimeout: 30000,
        requestTimeout: 30000
    }, () => {
        cy.get("[data-cy=page-menu-button]").should("be.visible").click();
        cy.get("[data-cy=page-menu-header]").should("be.visible");
        cy.get("[data-cy=page-menu-body]").should("be.visible");
        cy.get("[data-cy=page-menu-logo]").should("be.visible");
        cy.get("[data-cy=page-menu-close]").should("be.visible").click();
    });
    it("my account button", {
        defaultCommandTimeout: 30000,
        requestTimeout: 30000
    }, () => {
        cy.get("[data-cy=profile-button]").should("be.visible").click();
        cy.get("[data-cy=profile-account-button]").should("be.visible").click();
        cy.intercept("/account").as("lumium-accountpage");
        cy.url().should("contain", "/account");
        cy.visit("/page");
    });
    afterEach(() => {
        cy.get("[data-cy=profile-button]").should("be.visible").click();
        cy.get("[data-cy=profile-logout-button]").should("be.visible").click().click();
        cy.intercept("/").as("lumium-landingpage");
        cy.wait("@lumium-landingpage").its("response.statusCode").should("eq", 200);
    });
});
