# VenBraX Platform

Base de implementación para la Fase 0 de VenBraX.

## Alcance de esta fase

- Estructura del monorepo.
- Esquema inicial de PostgreSQL 16.
- Contratos de autenticación y onboarding.
- Esqueletos separados para `web`, `api` y `mobile`.

## Estado

- `apps/web`: scaffold inicial.
- `apps/api`: scaffold inicial con módulos de auth.
- `apps/mobile`: estructura preparada para Flutter.
- `infra/db`: migración inicial.
- `docs`: especificación de Fase 0.

## Siguientes pasos

1. Instalar dependencias del monorepo.
2. Implementar auth real con WebAuthn + password + MFA.
3. Conectar el onboarding de Denise al perfil persistente.
4. Desplegar entornos de prueba y revisar flujos.
