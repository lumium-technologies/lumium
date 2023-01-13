import { ROOT, AUTH_SIGNIN, AUTH_SIGNUP } from "@routes/space";

describe("/", () => {
    it("dark mode/light mode switch", () => {
        cy.visit(ROOT);
        cy.wait(3000);
        cy.dataCy("switchThemeButton").should("be.visible").click();
        cy.get("body").should("have.class", "chakra-ui-light");
        cy.dataCy("switchThemeButton").should("be.visible").click();
        cy.get("body").should("have.class", "chakra-ui-dark");
    });
    it("sign in button", () => {
        cy.visit(ROOT);
        cy.dataCy("signInButton").should("be.visible").click();
        cy.url().should('include', AUTH_SIGNIN);
    });
    it("sign up button", () => {
        cy.visit(ROOT);
        cy.dataCy("signUpButton").should("be.visible").click();
        cy.url().should('include', AUTH_SIGNUP);
    });
});
