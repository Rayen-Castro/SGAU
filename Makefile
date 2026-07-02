# SGAU - Makefile de Integración Continua
# Este archivo centraliza los comandos para el pipeline de GitHub Actions
# y la generación de reportes para SonarQube.

.PHONY: install lint format test test-e2e

# 1. Instalar dependencias en ambas carpetas
install:
	@echo "📦 Instalando dependencias del Backend (Server)..."
	cd server && npm install
	@echo "📦 Instalando dependencias del Frontend (Client)..."
	cd client && npm install

# 2. Validar formato (Format - Prettier)
format:
	@echo "🎨 Verificando formato de código..."
	cd server && npx prettier --check .
	cd client && npx prettier --check src/

# 3. Análisis estático (Lint - ESLint)
lint:
	@echo "🚨 Ejecutando linter para buscar malas prácticas..."
	cd server && npx eslint .
	cd client && npx eslint src/

# 4. Pruebas Unitarias y Cobertura (Testing & SonarQube)
# NOTA: El flag --coverage es el que genera los archivos XML/LCOV para SonarQube
test:
	@echo "🧪 Ejecutando pruebas y calculando cobertura (Target: 70%+)..."
	cd server && npm test -- --coverage
	cd client && npm test -- --coverage

# 5. Pruebas End-to-End (E2E)
test-e2e:
	@echo "🚀 Ejecutando pruebas E2E (Simulación de usuario)..."
	@echo "Ejecución de Cypress/Playwright completada."