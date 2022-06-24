describe("main page", () => {
    beforeEach(() => {
        cy.visit("/");
    });
    it("shows logo briefly", () => {
        expect(cy.get('#logo-transition')).to.exist;
    });
    it("brings document", () => {
        expect(cy.get("#page-canvas")).to.exist;
    });
});
