import { SPACES_CREATE } from "@routes/space";
import { makeid } from "cypress/support/makeid";

describe("/spaces/new", () => {
    it("name required", () => {
        cy.signUp().then(() => {
            cy.visit(SPACES_CREATE);
            const password: string = makeid();
            cy.dataCy("nameInput").should("be.visible");
            cy.dataCy("passwordInput").should("be.visible").type(password);
            cy.dataCy("passwordConfirmInput").should("be.visible").type(password);
            cy.dataCy("nextButton").should("be.visible").click();
            cy.dataCy("form").then(($form) => expect($form[0].checkValidity()).to.be.false,);
            cy.deleteAccount();
        });
    });
    it("password required", () => {
        cy.signUp().then(() => {
            cy.visit(SPACES_CREATE);
            const name: string = makeid();
            const password: string = makeid();
            cy.dataCy("nameInput").should("be.visible").type(name);
            cy.dataCy("passwordInput").should("be.visible");
            cy.dataCy("passwordConfirmInput").should("be.visible").type(password);
            cy.dataCy("nextButton").should("be.visible").click();
            cy.dataCy("form").then(($form) => expect($form[0].checkValidity()).to.be.false,);
            cy.deleteAccount();
        });
    });
    it("password confirmation required", () => {
        cy.signUp().then(() => {
            cy.visit(SPACES_CREATE);
            const name: string = makeid();
            const password: string = makeid();
            cy.dataCy("nameInput").should("be.visible").type(name);
            cy.dataCy("passwordInput").should("be.visible").type(password);
            cy.dataCy("passwordConfirmInput").should("be.visible");
            cy.dataCy("nextButton").should("be.visible").click();
            cy.dataCy("form").then(($form) => expect($form[0].checkValidity()).to.be.false,);
            cy.deleteAccount();
        });
    });
    it("password match error", () => {
        cy.signUp().then(() => {
            cy.visit(SPACES_CREATE);
            const name: string = makeid();
            const password: string = makeid();
            const passwordConfirm: string = makeid();
            cy.dataCy("nameInput").should("be.visible").type(name);
            cy.dataCy("passwordInput").should("be.visible").type(password);
            cy.dataCy("passwordConfirmInput").should("be.visible").type(passwordConfirm);
            cy.dataCy("nextButton").should("be.visible").click();
            cy.dataCy("passwordMatchError").should("be.visible");
            cy.deleteAccount();
        });
    });
    it("download keys and submit", () => {
        cy.signUp().then(() => {
            cy.visit(SPACES_CREATE);
            const name: string = makeid();
            const password: string = makeid();
            cy.dataCy("nameInput").should("be.visible").type(name);
            cy.dataCy("passwordInput").should("be.visible").type(password);
            cy.dataCy("passwordConfirmInput").should("be.visible").type(password);
            cy.dataCy("nextButton").should("be.visible").click();
            cy.dataCy("downloadButton").should("be.visible").click();
            cy.dataCy("submitButton").should("be.visible").click();
            cy.deleteAccount();
        });
    });
});
