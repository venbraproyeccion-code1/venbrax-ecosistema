# Contrato de Autenticación

## Flujo principal

1. Denise abre la app por primera vez.
2. Completa su registro.
3. El sistema crea su usuario administrador.
4. Se registra un factor biométrico si el dispositivo lo soporta.
5. Se emite una sesión segura.
6. A partir de allí entra directo al dashboard.

## Endpoints previstos

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/webauthn/start`
- `POST /auth/webauthn/finish`
- `POST /auth/mfa/verify`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

## Reglas

- Un solo usuario administrador inicial.
- Sesiones con expiración y refresh rotation.
- WebAuthn para huella o FaceID cuando exista soporte.
- Nunca exponer errores técnicos a la usuaria final.
