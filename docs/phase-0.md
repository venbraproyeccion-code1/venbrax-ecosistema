# Fase 0 - Estructura, Base de Datos y Auth

## Objetivo

Dejar listo el núcleo del sistema para que Denise pueda registrarse una sola vez, volver a entrar sin fricción y tener una base sólida para el resto de la plataforma.

## Decisiones de la fase

- `web`: React + TypeScript + Vite.
- `api`: NestJS sobre Node.js.
- `mobile`: Flutter.
- `db`: PostgreSQL 16.
- `auth`: correo + contraseña + WebAuthn + factor MFA opcional obligatorio para acciones críticas.

## Alcance funcional

1. Registro inicial de Denise.
2. Login persistente con sesión segura.
3. Registro de dispositivo y factor biométrico.
4. Perfil único de administradora.
5. Trazabilidad básica para eventos de auth.

## Entregables de esta fase

- Esquema SQL inicial.
- Contratos de auth.
- Estructura de carpetas.
- Esqueletos de app para web, api y mobile.

## Fuera de alcance por ahora

- Pagos.
- Firmas digitales.
- IA conversacional.
- Notificaciones push.
- Despliegue productivo completo.
