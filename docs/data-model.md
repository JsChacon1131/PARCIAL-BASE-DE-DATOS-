# Modelo entidad-relación (inferido del código original)

```mermaid
erDiagram
  administrative_dependency ||--o{ cultural_space : manages
  organization ||--o{ reservation : requests
  cultural_space ||--o{ reservation : receives
  administrative_dependency {
    int dependency_id PK
    varchar dependency_name
  }
  cultural_space {
    int cultural_space_id PK
    varchar space_name
    varchar address
    int max_capacity
    varchar conservation_status
    varchar operational_status
    int dependency_id FK
  }
  organization {
    int organization_id PK
    varchar organization_name
    varchar contact_email
    varchar phone
  }
  reservation {
    int reservation_id PK
    int cultural_space_id
    int organization_id FK
    int requested_capacity
    date reservation_date
    time start_time
    time end_time
    varchar reservation_status
  }
```

El vínculo `reservation.cultural_space_id` cruza las bases `db_reservas` y `db_patrimonio` y se valida en la aplicación. Este modelo se infiere de las consultas del repositorio: no constituye evidencia de que el esquema original del profesor tenga exactamente estos tipos o restricciones.
