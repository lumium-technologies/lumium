import { ROOT, AUTH_SIGNIN, ACCOUNT, SPACES_NEW, SPACES_CREATE, SPACES_JOIN, AUTH_SIGNUP, AUTH_PASSWORD_RESET } from "@routes/space";

describe("redirection", () => {
    before(() => {
        cy.signUp();
    });
    beforeEach(() => {
        cy.visit(ROOT);
    });
    it("redirect /account", () => {
        cy.visit(ACCOUNT);
        cy.url().should('include', AUTH_SIGNIN);
    });
    it("redirect /spaces/new", () => {
        cy.visit(SPACES_NEW);
        cy.url().should('include', AUTH_SIGNIN);
    });
    it("redirect /spaces/create", () => {
        cy.visit(SPACES_CREATE);
        cy.url().should('include', AUTH_SIGNIN);
    });
    it("redirect /spaces/join", () => {
        cy.visit(SPACES_JOIN);
        cy.url().should('include', AUTH_SIGNIN);
    });
    it("redirect after signin /auth/signin", () => {
        cy.signIn();
        cy.visit(AUTH_SIGNIN);
        cy.url().should('include', SPACES_NEW);
    });
    it("redirect after signin /auth/signup", () => {
        cy.signIn();
        cy.visit(AUTH_SIGNUP);
        cy.url().should('include', SPACES_NEW);
    });
    it("redirect after signin /auth/signup", () => {
        cy.signIn();
        cy.visit(AUTH_SIGNUP);
        cy.url().should('include', SPACES_NEW);
    });
    it("redirect after signin /auth/reset-password", () => {
        cy.signIn();
        cy.visit(AUTH_PASSWORD_RESET);
        cy.url().should('include', SPACES_NEW);
    });
});