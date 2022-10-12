describe("auth page", () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.visit("/");
    });
    it("redirect to login from workspace", () => {
        cy.visit("/workspace");
        cy.interceptAndWait("/auth/signin", 200);
        cy.login();
    });
    it("redirect to login from account", () => {
        cy.visit("/account");
        cy.interceptAndWait("/auth/signin", 200);
        cy.login();
        cy.interceptAndWait("/account", 200);
    });
    it("redirect to login from spaces", () => {
        cy.visit("/spaces");
        cy.interceptAndWait("/auth/signin", 200);
        cy.login();
        cy.interceptAndWait("/spaces", 200);
    });
});
