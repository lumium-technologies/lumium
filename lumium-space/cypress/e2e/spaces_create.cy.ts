import { SPACES_CREATE } from "@routes/space";
import { makeid } from "cypress/support/makeid";

describe("/spaces/new", () => {
    before(() => {
        cy.signUp();
    });
    beforeEach(() => {
        cy.signIn();
        cy.visit(SPACES_CREATE);
    });
    it("name required", () => {
        const password: string = makeid(50);
        cy.dataCy("nameInput").should("be.visible");
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("passwordConfirmInput").should("be.visible").type(password);
        cy.dataCy("nextButton").should("be.visible").click();
        cy.dataCy("form").then(($form) => expect($form[0].checkValidity()).to.be.false,);
    });
    it("password required", () => {
        const name: string = makeid(50);
        const password: string = makeid(50);
        cy.dataCy("nameInput").should("be.visible").type(name);
        cy.dataCy("passwordInput").should("be.visible");
        cy.dataCy("passwordConfirmInput").should("be.visible").type(password);
        cy.dataCy("nextButton").should("be.visible").click();
        cy.dataCy("form").then(($form) => expect($form[0].checkValidity()).to.be.false,);
    });
    it("password confirmation required", () => {
        const name: string = makeid(50);
        const password: string = makeid(50);
        cy.dataCy("nameInput").should("be.visible").type(name);
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("passwordConfirmInput").should("be.visible");
        cy.dataCy("nextButton").should("be.visible").click();
        cy.dataCy("form").then(($form) => expect($form[0].checkValidity()).to.be.false,);
    });
    it("password match error", () => {
        const name: string = makeid(50);
        const password: string = makeid(50);
        const passwordConfirm: string = makeid(50);
        cy.dataCy("nameInput").should("be.visible").type(name);
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("passwordConfirmInput").should("be.visible").type(passwordConfirm);
        cy.dataCy("nextButton").should("be.visible").click();
        cy.dataCy("passwordMatchError").should("be.visible");
    });
    it("download keys and submit", () => {
        const name: string = makeid(50);
        const password: string = makeid(50);
        cy.dataCy("nameInput").should("be.visible").type(name);
        cy.dataCy("passwordInput").should("be.visible").type(password);
        cy.dataCy("passwordConfirmInput").should("be.visible").type(password);
        cy.dataCy("nextButton").should("be.visible").click();
        cy.dataCy("downloadButton").should("be.visible").click();
        cy.dataCy("submitButton").should("be.visible").click();
    });
});