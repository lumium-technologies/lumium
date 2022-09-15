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
        cy.get("body").should("have.class", "chakra-ui-light");
        cy.get("[data-cy=color-theme-switcher]").click();
        cy.get("body").should("have.class", "chakra-ui-dark");
        cy.get("[data-cy=color-theme-switcher]").click();
        cy.get("body").should("have.class", "chakra-ui-light");
    });
});
