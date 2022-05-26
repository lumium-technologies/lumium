describe("Main page", () => {
    beforeEach(() => {
        cy.visit("/");
    });
    it("Brings document", () => {
        expect(cy.get("#page-canvas")).to.exist;
    });
});
