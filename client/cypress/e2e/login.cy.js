// client/cypress/e2e/login.cy.js
describe("Flujo de Autenticación SGAU", () => {
  it("Debe permitir a un usuario iniciar sesión correctamente", () => {
    // 1. El robot visita la página
    cy.visit("http://localhost:5173");

    // 2. El robot busca el campo de correo y escribe
    cy.get('input[type="email"]').type("admin@uct.cl");

    // 3. El robot busca el campo de contraseña y escribe
    cy.get('input[type="password"]').type("admin1234");

    // 4. El robot hace clic en el botón de entrar
    cy.contains("button", "Ingresar al Sistema").click();

    // 5. Verificar login exitoso buscando:
    cy.contains("Sistema Académico Integrado").should("be.visible");
  });
});
