import { ROOT, AUTH_SIGNIN, AUTH_SIGNUP } from "@routes/space";

describe("/", () => {
    beforeEach(() => {
        cy.visit(ROOT);
    });
    it("dark mode/light mode switch", () => {
        cy.dataCy("switchThemeButton").should("be.visible").click();
        cy.get("body").should("have.class", "chakra-ui-light");
        cy.dataCy("switchThemeButton").should("be.visible").click();
        cy.get("body").should("have.class", "chakra-ui-dark");
    });
    it("sign in button", () => {
        cy.dataCy("signInButton").should("be.visible").click();
        cy.url().should('include', AUTH_SIGNIN);
    });
    it("sign up button", () => {
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.url().should('include', AUTH_SIGNUP);
    });
});