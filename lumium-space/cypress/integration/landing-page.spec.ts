describe("landing page", () => {
    beforeEach(() => {
        cy.visit("/");
    });
    it("hero screen", {
        defaultCommandTimeout: 30000
    }, () => {
        cy.get("[data-cy=logo-transition]").should("be.visible");
        cy.get("[data-cy=github-link]").should("be.visible");
        cy.get("[data-cy=color-theme-switcher]").should("be.visible");
        cy.get("[data-cy=continue-button]").should("be.visible");
        cy.get("[data-cy=signup-button]").should("be.visible");
        cy.get("[data-cy=lumium-color-fade]").should("be.visible");
        cy.get("[data-cy=lumium-tagline]").should("be.visible");
        cy.get("[data-cy=lumium-description]").should("be.visible");
        cy.get("[data-cy=lumium-hero-image]").should("be.visible");
    });
    it("dark mode/light mode switch", () => {
        cy.get("body").should("have.class", "chakra-ui-dark");
        cy.get("[data-cy=color-theme-switcher]").click();
        cy.get("body").should("have.class", "chakra-ui-light");
        cy.get("[data-cy=color-theme-switcher]").click();
        cy.get("body").should("have.class", "chakra-ui-dark");
    });
    it("sign up button", {
        defaultCommandTimeout: 30000
    }, () => {
        cy.get("[data-cy=signup-button]").click();
        cy.get("#supertokens-root").should("be.visible");
    });
    it("login button", {
        defaultCommandTimeout: 30000,
        requestTimeout: 30000
    }, () => {
        cy.get("[data-cy=continue-button]").click();
        cy.xpath("//*[@id=\"supertokens-root\"]/div/div/form/div[1]/div[2]/div/input").type(Cypress.env('TEST_USER_EMAIL'));
        cy.xpath("//*[@id=\"supertokens-root\"]/div/div/form/div[2]/div[2]/div/input").type(Cypress.env('TEST_USER_PASS'));
        cy.xpath("//*[@id=\"supertokens-root\"]/div/div/form/div[3]/button").click();
        cy.intercept("/page").as("lumium-workspace");
        cy.wait("@lumium-workspace").its("response.statusCode").should("eq", 200);
    });
    it("redirect to login from page", {
        defaultCommandTimeout: 30000,
        requestTimeout: 30000
    }, () => {
        cy.visit("/page");
        cy.intercept("/auth").as("lumium-auth");
        cy.wait("@lumium-auth").its("response.statusCode").should("eq", 401);
        cy.get("#supertokens-root").should("be.visible");
        cy.xpath("//*[@id=\"supertokens-root\"]/div/div/form/div[1]/div[2]/div/input").type(Cypress.env('TEST_USER_EMAIL'));
        cy.xpath("//*[@id=\"supertokens-root\"]/div/div/form/div[2]/div[2]/div/input").type(Cypress.env('TEST_USER_PASS'));
        cy.xpath("//*[@id=\"supertokens-root\"]/div/div/form/div[3]/button").click();
        cy.intercept("/page").as("lumium-workspace");
        cy.wait("@lumium-workspace").its("response.statusCode").should("eq", 200);
    });
    it("redirect to login from account", {
        defaultCommandTimeout: 30000,
        requestTimeout: 30000
    }, () => {
        cy.visit("/account");
        cy.intercept("/auth").as("lumium-auth");
        cy.wait("@lumium-auth").its("response.statusCode").should("eq", 401);
        cy.get("#supertokens-root").should("be.visible");
        cy.xpath("//*[@id=\"supertokens-root\"]/div/div/form/div[1]/div[2]/div/input").type(Cypress.env('TEST_USER_EMAIL'));
        cy.xpath("//*[@id=\"supertokens-root\"]/div/div/form/div[2]/div[2]/div/input").type(Cypress.env('TEST_USER_PASS'));
        cy.xpath("//*[@id=\"supertokens-root\"]/div/div/form/div[3]/button").click();
        cy.intercept("/account").as("lumium-account");
        cy.wait("@lumium-account").its("response.statusCode").should("eq", 200);
    });
});
