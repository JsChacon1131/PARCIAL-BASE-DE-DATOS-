# Gestión de espacios culturales y reservas

Aplicación web de Node.js, Express y MySQL desarrollada a partir del ejemplo [Node_MySQL_Example](https://github.com/memin2522/Node_MySQL_Example) del profesor.

## Funcionalidades

- Registrar y consultar espacios culturales en `db_patrimonio`.
- Registrar y consultar organizaciones en `db_reservas`.
- Registrar reservas pendientes y consultar su estado.
- Validar aforo, disponibilidad del espacio, existencia de la organización y traslapes con reservas aprobadas.

## Ejecución

1. Instalar Node.js y MySQL.
2. Crear las bases de datos y tablas indicadas en `docs/database-schema.sql` (en una instalación existente, comprobar el esquema antes de ejecutarlo).
3. Ejecutar `npm ci`.
4. Configurar las variables de `.env.example` en el entorno de ejecución. No subir credenciales al repositorio. Opcionalmente copiar a `.env` y cargarlo con `node --env-file=.env server.js` usando una versión de Node.js que soporte esa opción.
5. Ejecutar `npm start` y abrir `http://localhost:5000`.

También se puede iniciar la aplicación con variables de entorno exportadas desde la terminal.

## API

| Método | Ruta | Acción |
| --- | --- | --- |
| GET | `/api/spaces` | Listar espacios |
| GET | `/api/spaces/:id` | Consultar espacio |
| POST | `/api/spaces` | Registrar espacio |
| GET | `/api/organizations` | Listar organizaciones |
| GET | `/api/organizations/:id` | Consultar organización |
| POST | `/api/organizations` | Registrar organización |
| GET | `/api/reservations` | Listar reservas |
| GET | `/api/reservations/:id` | Consultar estado |
| POST | `/api/reservations` | Registrar reserva pendiente |

Las solicitudes POST se envían como JSON. Los nombres de campos corresponden a las columnas de la base de datos. Una reserva requiere `cultural_space_id`, `organization_id`, `requested_capacity`, `reservation_date` (AAAA-MM-DD), `start_time` y `end_time` (HH:MM).

## Organización

- `routes/`: definición de rutas REST.
- `dao/`: consultas y reglas de acceso a datos por entidad.
- `services/`: pools de conexión MySQL.
- `env/`: configuración de conexiones mediante variables de entorno.
- `utils/`: validaciones y respuesta a errores.
- `public/`: interfaz web.
- `docs/`: esquema SQL y modelo entidad-relación.

## Comprobación

`npm test` ejecuta pruebas de validación sin necesidad de MySQL. Para comprobar registros y consultas reales, iniciar el servidor con ambas bases disponibles y probar los formularios.

**Importante:** el proyecto original no incluye un volcado de la base de datos. El esquema incluido se reconstruyó a partir de las consultas del código y debe contrastarse con el esquema que proporciona el docente antes de usarlo sobre datos existentes.
