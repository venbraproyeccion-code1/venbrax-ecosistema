# Despliegue

## Ruta sugerida

Para comenzar barato y simple, usa Render:

- `apps/web` como Static Site.
- `apps/api` como Web Service.
- PostgreSQL administrado o externo para producción.

## Variables principales

- `VITE_API_URL`
- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`

## Comandos de build

- Web: `npm run build --workspace @venbrax/web`
- API: `npm run build --workspace @venbrax/api`

## Nota práctica

La infraestructura cloud necesita cuentas y credenciales reales para quedar publicada. El código y los archivos de despliegue ya quedan listos para conectar.
