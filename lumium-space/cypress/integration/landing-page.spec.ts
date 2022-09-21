describe("landing page", () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.visit("/");
    });
    it("hero screen", {
        defaultCommandTimeout: 30000
    }, () => {
        cy.dataCy("logo-transition").should("be.visible");
        cy.dataCy("github-link").should("be.visible");
        cy.dataCy("color-theme-switcher").should("be.visible");
        cy.dataCy("continue-button").should("be.visible");
        cy.dataCy("signup-button").should("be.visible");
        cy.dataCy("lumium-color-fade").should("be.visible");
        cy.dataCy("lumium-tagline").should("be.visible");
        cy.dataCy("lumium-description").should("be.visible");
        cy.dataCy("lumium-hero-image").should("be.visible");
    });
    it("dark mode/light mode switch", () => {
        cy.get("body").should("have.class", "chakra-ui-dark");
        cy.dataCy("color-theme-switcher").click();
        cy.get("body").should("have.class", "chakra-ui-light");
        cy.dataCy("color-theme-switcher").click();
        cy.get("body").should("have.class", "chakra-ui-dark");
    });
    it("sign up button", {
        defaultCommandTimeout: 30000
    }, () => {
        cy.dataCy("signup-button").click();
        cy.get("#supertokens-root").should("be.visible");
    });
    it("login button", {
        defaultCommandTimeout: 30000,
        requestTimeout: 30000
    }, () => {
        cy.dataCy("continue-button").click();
        cy.login()
        cy.intnwait("/page", 200);
    });
    it("redirect to login from page", {
        defaultCommandTimeout: 30000,
        requestTimeout: 30000
    }, () => {
        cy.visit("/page");
        cy.intnwait("/auth", 401);
        cy.get("#supertokens-root").should("be.visible");
        cy.login()
        cy.intnwait("/page", 200);
    });
    it("redirect to login from account", {
        defaultCommandTimeout: 30000,
        requestTimeout: 30000
    }, () => {
        cy.visit("/account");
        cy.intnwait("/auth", 401);
        cy.get("#supertokens-root").should("be.visible");
        cy.login()
        cy.intnwait("/page", 200);
    });
});
